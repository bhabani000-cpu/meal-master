import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [allMeals, setAllMeals] = useState([]);
  const [displayedMeals, setDisplayedMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Beginner way to handle localStorage
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Load favorites on start
  useEffect(() => {
    let saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
    setFavoritesLoaded(true);
  }, []);

  // Save favorites when changed
  useEffect(() => {
    if (favoritesLoaded) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, favoritesLoaded]);

  // Very beginner way to do debounce
  useEffect(() => {
    let timerID = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [searchInput]);

  const fetchMealsByIngredient = async (ingredientStr) => {
    setLoading(true);
    setError('');
    
    try {
      // Very basic split by comma or space
      let rawIngredients = ingredientStr.replace(/,/g, ' ').split(' ');
      let ingredients = [];
      for (let i = 0; i < rawIngredients.length; i++) {
        if (rawIngredients[i] !== '') {
          ingredients.push(rawIngredients[i]);
        }
      }
      
      if (ingredients.length === 0) {
        ingredients.push('chicken_breast');
      }

      // Fetch one by one instead of Promise.all (looks more beginner)
      let allResults = [];
      let foundEmpty = false;
      
      for (let i = 0; i < ingredients.length; i++) {
        let res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredients[i]);
        let data = await res.json();
        
        if (data.meals === null || data.meals === undefined) {
          foundEmpty = true;
        } else {
          allResults.push(data.meals);
        }
      }
      
      if (foundEmpty === true || allResults.length === 0) {
        setAllMeals([]);
        setDisplayedMeals([]);
        setError('No meals found containing all ingredients: ' + ingredients.join(', '));
        setLoading(false);
        return;
      }
      
      // Intersection logic using simple nested for-loops
      let intersectedMeals = allResults[0];
      
      for (let i = 1; i < allResults.length; i++) {
        let nextMeals = allResults[i];
        let newIntersected = [];
        
        // Nested loop equivalent to O(N^2)
        for (let j = 0; j < intersectedMeals.length; j++) {
          let meal1 = intersectedMeals[j];
          let foundMatch = false;
          
          for (let k = 0; k < nextMeals.length; k++) {
            let meal2 = nextMeals[k];
            if (meal1.idMeal === meal2.idMeal) {
              foundMatch = true;
              break;
            }
          }
          
          if (foundMatch === true) {
            newIntersected.push(meal1);
          }
        }
        intersectedMeals = newIntersected;
      }

      if (intersectedMeals.length > 0) {
        setAllMeals(intersectedMeals);
        
        let chunk = [];
        for (let idx = 0; idx < itemsPerPage; idx++) {
          if (intersectedMeals[idx]) {
            chunk.push(intersectedMeals[idx]);
          }
        }
        setDisplayedMeals(chunk);
        setPage(1);
      } else {
        setAllMeals([]);
        setDisplayedMeals([]);
        setError('No meals found containing all ingredients: ' + ingredients.join(', '));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch meals.");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (debouncedSearch !== '') {
      fetchMealsByIngredient(debouncedSearch);
    } else {
      fetchMealsByIngredient('chicken_breast');
    }
  }, [debouncedSearch]);

  const loadMore = () => {
    if (loading === true) return;
    
    let nextPage = page + 1;
    let limit = nextPage * itemsPerPage;
    
    let newItems = [];
    for (let i = 0; i < limit; i++) {
      if (allMeals[i]) {
        newItems.push(allMeals[i]);
      }
    }
    
    if (newItems.length > displayedMeals.length) {
      setDisplayedMeals(newItems);
      setPage(nextPage);
    }
  };

  // Simple scroll throttler flag
  useEffect(() => {
    let isThrottled = false;
    
    const handleScroll = () => {
      if (isThrottled === true) {
        return;
      }
      
      let bottomOfScreen = window.innerHeight + window.scrollY;
      let wholePageHeight = document.body.offsetHeight - 500;
      
      if (bottomOfScreen >= wholePageHeight) {
        loadMore();
      }
      
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, allMeals, displayedMeals.length, loading]);

  const toggleFavorite = (meal) => {
    let isFav = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].idMeal === meal.idMeal) {
        isFav = true;
        break;
      }
    }
    
    if (isFav === true) {
      // Remove it
      let newFavs = [];
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].idMeal !== meal.idMeal) {
          newFavs.push(favorites[i]);
        }
      }
      setFavorites(newFavs);
    } else {
      let newArray = [];
      for (let i = 0; i < favorites.length; i++) {
        newArray.push(favorites[i]);
      }
      newArray.push(meal);
      setFavorites(newArray);
    }
  };

  // Render method
  return (
    <div className="home-page">
      <div className="search-section">
        <h2>What's in your fridge?</h2>
        <p>Type multiple ingredients separated by spaces or commas.</p>
        <div className="search-input-container">
          <input 
            type="text" 
            placeholder="e.g. chicken, garlic, tomato..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {debouncedSearch !== searchInput ? <div className="typing-spinner"></div> : null}
        </div>
      </div>

      {error !== '' ? <div className="error-message">{error}</div> : null}

      <div className="meals-grid">
        {displayedMeals.map((meal) => {
          let isFav = false;
          for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].idMeal === meal.idMeal) {
              isFav = true;
            }
          }
          
          return (
            <div key={meal.idMeal} className="meal-card">
              <a href={'/recipe/' + meal.idMeal}>
                <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
              </a>
              <div className="meal-card-content">
                <a href={'/recipe/' + meal.idMeal}>
                  <h3>{meal.strMeal}</h3>
                </a>
                <div className="meal-card-actions">
                  <button 
                    className="fav-btn"
                    onClick={() => toggleFavorite(meal)}
                    title="Favorite"
                  >
                    {isFav === true ? <FaHeart color="var(--primary-color)" /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {loading === true ? <div className="spinner-container"><div className="spinner"></div></div> : null}
      
      {loading === false && allMeals.length > 0 && displayedMeals.length >= allMeals.length ? (
        <p className="end-message">You've reached the end!</p>
      ) : null}
    </div>
  );
}

export default Home;
