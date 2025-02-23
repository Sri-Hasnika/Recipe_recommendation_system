const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
  mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list that matches the ingredients
function getMealList() {
  const searchInputTxt = document.getElementById('search-input').value.trim();
  if (!searchInputTxt) {
    mealList.innerHTML = "<p>Please enter ingredients to search.</p>";
    return;
  }

  const ingredients = searchInputTxt.split(' ').join(',');
  fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=184f48a3753e487ca59f1a55e708c6ac`)
    .then(response => {
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      let html = "";
      if (data && data.length > 0) {
        data.forEach(meal => {
          html += `
            <div class="meal-item" data-id="${meal.id}">
              <div class="meal-img">
                <img src="${meal.image}" alt="food">
              </div>
              <div class="meal-name">
                <h3>${meal.title}</h3>
                <a href="#" class="recipe-btn">Get Recipe</a>
              </div>
            </div>
          `;
        });
        mealList.classList.remove('notFound');
      } else {
        html = "<p>Sorry, no meals found with the provided ingredients.</p>";
        mealList.classList.add('notFound');
      }
      mealList.innerHTML = html;
    })
    .catch(error => {
      console.error('Error fetching meal list:', error);
      mealList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    });
}

// Get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe-btn')) {
    const mealItem = e.target.parentElement.parentElement;
    fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=184f48a3753e487ca59f1a55e708c6ac`)
      .then(response => {
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
      })
      .then(data => mealRecipeModal(data))
      .catch(error => {
        console.error('Error fetching meal details:', error);
        mealDetailsContent.innerHTML = "<p>Unable to fetch meal details. Please try again.</p>";
      });
  }
}

// Create a modal for the meal recipe
function mealRecipeModal(meal) {
  const ingredients = meal.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');

  const html = `
    <h2 class="recipe-title">${meal.title}</h2>
    <p class="recipe-category">${meal.dishTypes.join(', ')}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.instructions || "No instructions available."}</p>
    </div>
    <div class="recipe-ingredients">
      <h3>Ingredients:</h3>
      <ul>${ingredients}</ul>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.image}" alt="${meal.title}">
    </div>
    <div class="recipe-link">
      <a href="${meal.sourceUrl}" target="_blank">View Full Recipe</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}
document.addEventListener('DOMContentLoaded', () => {
    const quoteText = "Real food doesn't have ingredients, real food is ingredients.";
    const typingSpan = document.querySelector('#typing-effect span');
    let charIndex = 0;
  
    const typeQuote = () => {
      if (charIndex < quoteText.length) {
        typingSpan.textContent += quoteText[charIndex];
        charIndex++;
        setTimeout(typeQuote, 100); // Adjust typing speed by changing the delay
      }
    };
  
    typeQuote();
  });
  