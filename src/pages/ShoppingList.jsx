import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [listLoaded, setListLoaded] = useState(false);

  useEffect(() => {
    let savedList = localStorage.getItem('shoppingList');
    if (savedList) {
      setShoppingList(JSON.parse(savedList));
    }
    
    let savedChecks = localStorage.getItem('checkedItems');
    if (savedChecks) {
      setCheckedItems(JSON.parse(savedChecks));
    }
    setListLoaded(true);
  }, []);

  useEffect(() => {
    if (listLoaded === true) {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }
  }, [shoppingList, listLoaded]);

  useEffect(() => {
    if (listLoaded === true) {
      localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
    }
  }, [checkedItems, listLoaded]);

  const removeRecipe = (idMeal) => {
    // Beginner way to filter
    let newList = [];
    for (let i = 0; i < shoppingList.length; i++) {
      if (shoppingList[i].idMeal !== idMeal) {
        newList.push(shoppingList[i]);
      }
    }
    setShoppingList(newList);
  };

  const toggleCheck = (uniqueKey) => {
    // Beginner way to update object
    let newChecks = Object.assign({}, checkedItems);
    if (newChecks[uniqueKey] === true) {
      newChecks[uniqueKey] = false;
    } else {
      newChecks[uniqueKey] = true;
    }
    setCheckedItems(newChecks);
  };

  const clearAll = () => {
    setShoppingList([]);
    setCheckedItems({});
  };

  if (shoppingList.length === 0) {
    return (
      <div className="shopping-list-page empty">
        <h2>Your Shopping List</h2>
        <p>Your list is empty! Go browse some recipes and add them to your cart.</p>
      </div>
    );
  }

  // Aggregate all ingredients using simple nested loops
  let allIngredients = [];
  for (let i = 0; i < shoppingList.length; i++) {
    let recipe = shoppingList[i];
    
    for (let j = 0; j < recipe.ingredients.length; j++) {
      let ing = recipe.ingredients[j];
      
      let itemObject = {
        recipeName: recipe.strMeal,
        ingredient: ing
      };
      
      allIngredients.push(itemObject);
    }
  }

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-header">
        <h2>Your Shopping Cart ({shoppingList.length}/3 Recipes)</h2>
        <button className="btn-danger" onClick={clearAll}>Clear All</button>
      </div>

      <div className="recipes-in-list">
        <h3>Recipes Added:</h3>
        <ul>
          {shoppingList.map((recipe) => {
            return (
              <li key={recipe.idMeal}>
                <span>{recipe.strMeal}</span>
                <button 
                  className="btn-icon" 
                  onClick={() => removeRecipe(recipe.idMeal)}
                  title="Remove Recipe"
                >
                  <FaTrash />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="ingredients-list">
        <h3>Ingredients to Buy:</h3>
        <div className="ingredients-grid">
          {allIngredients.map((item, idx) => {
            let uniqueKey = item.recipeName + '-' + item.ingredient + '-' + idx;
            let isChecked = false;
            
            if (checkedItems[uniqueKey] === true) {
              isChecked = true;
            }
            
            let classString = "ingredient-item";
            if (isChecked === true) {
              classString = "ingredient-item checked";
            }
            
            return (
              <label key={uniqueKey} className={classString}>
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => toggleCheck(uniqueKey)} 
                />
                <span className="ingredient-text">{item.ingredient}</span>
                <span className="ingredient-recipe-tag">{item.recipeName}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
