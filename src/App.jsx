import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const searchMeals = async () => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    
    if (data.meals) {
      setMeals(data.meals);
    } else {
      setMeals([]);
    }
  };

  return (
    <div className="container">
      <h1>Meal Master</h1>
      <p>Search for an ingredient to find recipes!</p>
      
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Type chicken, beef, potato..." 
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button onClick={searchMeals}>Search</button>
      </div>
      
      <div className="meals-grid">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="meal-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h2>{meal.strMeal}</h2>
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <a href={meal.strYoutube} target="_blank" rel="noreferrer">Watch Video</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
