import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- 1. State Management ---
  // API Fetch State
  const [meals, setMeals] = useState([]);
  
  // Local Interactive States (for array operations)
  const [localSearch, setLocalSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 2. Dark Mode Implementation ---
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // --- 3. API Fetching on Mount ---
  useEffect(() => {
    const fetchInitialMeals = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        const data = await response.json();
        
        if (data.meals) {
          setMeals(data.meals);
        } else {
          setMeals([]);
        }
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    };

    fetchInitialMeals();
  }, []);

  // --- 4. Button Interactions ---
  // Toggle favorites using higher-order array methods (filter)
  const toggleFavorite = (mealId) => {
    if (favorites.includes(mealId)) {
      // Remove via .filter()
      setFavorites(favorites.filter(id => id !== mealId));
    } else {
      // Add via spread
      setFavorites([...favorites, mealId]);
    }
  };

  // --- 5. Data Manipulation (Sorting, Filtering, Searching) ---
  
  // A. Local Searching and Filtering using .filter()
  let displayedMeals = meals.filter((meal) => {
    const matchesSearch = meal.strMeal.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || meal.strCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // B. Sorting using .sort()
  if (sortOrder === 'asc') {
    displayedMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  } else if (sortOrder === 'desc') {
    displayedMeals.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
  }

  // Generate unique categories for the dropdown using .map() and Set
  const categories = ['All', ...new Set(meals.map(meal => meal.strCategory))];

  // --- 6. Render ---
  return (
    <div className="container">
      <div className="header">
        <h1>Meal Master</h1>
        {/* Dark Mode Toggle Button */}
        <button 
          className="theme-toggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Interactive Controls Section */}
      <div className="controls-section">
        {/* Local Searching */}
        <input 
          type="text" 
          placeholder="🔍 Search fetched results..." 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="local-search-input"
        />
        
        {/* Local Filtering */}
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Local Sorting */}
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort: Default</option>
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>

      {/* Results Section */}
      <div className="meals-grid">
        {displayedMeals.length > 0 ? (
          displayedMeals.map((meal) => (
            <div key={meal.idMeal} className="meal-card">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-card-content">
                <div className="meal-title-row">
                  <h2>{meal.strMeal}</h2>
                  {/* Favorite Button Interaction */}
                  <button 
                    className={`fav-btn ${favorites.includes(meal.idMeal) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(meal.idMeal)}
                    title={favorites.includes(meal.idMeal) ? 'Remove Favorite' : 'Add Favorite'}
                  >
                    {favorites.includes(meal.idMeal) ? '❤️' : '🤍'}
                  </button>
                </div>
                <p><strong>Category:</strong> {meal.strCategory}</p>
                <div className="meal-actions">
                  <a href={meal.strYoutube} target="_blank" rel="noreferrer">Watch Video</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          meals.length > 0 && <p className="no-results">No local recipes match your search/filters.</p>
        )}
      </div>
    </div>
  );
}

export default App;
