# Meal Master - Recipe Finder 🍳

Meal Master is a beginner-friendly, responsive single-page recipe application built in React. It allows users to search for delicious meals based on ingredients they currently have, view detailed cooking instructions, and even save ingredients systematically into a digital shopping list. 

**Live Demo**: [https://meal-master-azure.vercel.app](https://meal-master-azure.vercel.app)

![Meal Master Demo](public/pwa-512x512.png)

## 🌟 Features

* **Multi-Ingredient Intersection Search**: Search for multiple ingredients at once (e.g., `chicken, garlic, tomato`). The app runs simultaneous background requests natively to find meals containing *all* of your selected ingredients.
* **Shopping Cart Manager**: You can click "Add to Shopping List" on any recipe. The app compiles and organizes checkboxes for your ingredients (up to 3 recipes max) directly into your local browser storage.
* **Progressive Web App (PWA)**: Meal Master is PWA-enabled. You can install it on your iOS or Android device "Add to Home Screen" to use it just like a native mobile app.
* **Beginner-Friendly Under the Hood**: The codebase is architected using old-school Javascript loops, standard `for` logic, and inline components, making it incredibly easy for junior React developers to read, trace, and learn from. 
* **Performance Elements**:
  - `Debouncing` on the main search bar to prevent useless API spam while typing.
  - `Throttling` on the infinite scroll algorithm to boost device processing efficiency.

## 🔗 Public API
Powered free by **[TheMealDB API](https://www.themealdb.com/api.php)**.

## 💻 Technologies
- React 18 (via Vite)
- JavaScript (ES6+ basics)
- React Router DOM
- CSS Vanilla (Variables, Glassmorphism, Responsive Grid System)
- `vite-plugin-pwa` (Service Worker)

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhabani000-cpu/meal-master.git
   cd meal-master
   ```
2. **Install exact dependencies:**
   ```bash
   npm install
   ```
3. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   *Your app should now be running locally on `http://localhost:5173`.*

4. **Build for Production (PWA Support):**
   ```bash
   npm run build
   npm run preview
   ```
