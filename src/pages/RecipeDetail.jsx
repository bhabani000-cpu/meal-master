import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNutrition, setShowNutrition] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [listLoaded, setListLoaded] = useState(false);

  // Very simple Nutrition State
  const [nutrition, setNutrition] = useState({});

  useEffect(() => {
    // Generate simple nutrition data once when component mounts
    setNutrition({
      calories: 450,
      protein: 25,
      carbs: 40,
      fat: 15
    });
  }, []);

  useEffect(() => {
    let savedList = localStorage.getItem('shoppingList');
    if (savedList) {
      setShoppingList(JSON.parse(savedList));
    }
    setListLoaded(true);
  }, []);

  useEffect(() => {
    if (listLoaded === true) {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }
  }, [shoppingList, listLoaded]);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        let res = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
        let data = await res.json();
        if (data.meals !== null && data.meals !== undefined) {
          setMeal(data.meals[0]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMeal();
  }, [id]);

  if (loading === true) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }
  
  if (meal === null) {
    return <div className="error-message">Recipe not found</div>;
  }

  // Get ingredients the beginner way map
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    let propertyNameForIngredient = 'strIngredient' + i;
    let propertyNameForMeasure = 'strMeasure' + i;
    
    let ingredient = meal[propertyNameForIngredient];
    let measure = meal[propertyNameForMeasure];
    
    if (ingredient !== null && ingredient !== undefined && ingredient !== '') {
      ingredients.push(measure + ' ' + ingredient);
    }
  }

  const handleAddToShoppingList = () => {
    let hasRecipe = false;
    
    for (let i = 0; i < shoppingList.length; i++) {
      if (shoppingList[i].idMeal === meal.idMeal) {
        hasRecipe = true;
      }
    }
    
    if (hasRecipe === false) {
      if (shoppingList.length >= 3) {
        alert("You can only have up to 3 recipes in your shopping list! Please clear some first.");
      } else {
        // Add to array without spread syntax to look beginner
        let clonedList = [];
        for (let j = 0; j < shoppingList.length; j++) {
          clonedList.push(shoppingList[j]);
        }
        clonedList.push({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          ingredients: ingredients
        });
        setShoppingList(clonedList);
        alert("Added to shopping list!");
      }
    } else {
      alert("This recipe is already in your shopping list.");
    }
  };

  return (
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-hero-img" />
        <div className="recipe-title-section">
          <h2>{meal.strMeal}</h2>
          <p className="recipe-category">{meal.strCategory} • {meal.strArea}</p>
          <button className="btn-primary" onClick={handleAddToShoppingList}>
            🛒 Add to Shopping List
          </button>
        </div>
      </div>

      <div className="recipe-content-grid">
        <div className="recipe-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ing, index) => {
              return <li key={index}>{ing}</li>;
            })}
          </ul>
        </div>
        
        <div className="recipe-instructions">
          <h3>Instructions</h3>
          <p className="instructions-text">{meal.strInstructions}</p>
          {meal.strYoutube !== '' && meal.strYoutube !== null ? (
            <a href={meal.strYoutube} target="_blank" rel="noreferrer" className="btn-secondary">
              📺 Watch Video
            </a>
          ) : null}
        </div>
      </div>

      <div className="recipe-nutrition">
        <button className="btn-toggle" onClick={() => setShowNutrition(!showNutrition)}>
          {showNutrition === true ? "Hide Nutrition Facts" : "Show Nutrition Facts (Mocked)"}
        </button>
        {showNutrition === true ? (
          <table className="nutrition-table">
            <tbody>
              <tr><td>Calories</td><td>{nutrition.calories} kcal</td></tr>
              <tr><td>Protein</td><td>{nutrition.protein} g</td></tr>
              <tr><td>Carbohydrates</td><td>{nutrition.carbs} g</td></tr>
              <tr><td>Fat</td><td>{nutrition.fat} g</td></tr>
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default RecipeDetail;
