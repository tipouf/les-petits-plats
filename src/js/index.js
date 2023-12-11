import { dropdown } from "./components/dropdown.js";
import { search } from "./components/search.js";
import { recipeCard } from "./template/card.js";

function init() {
  console.log("init");
  dropdown();
  search();

  searchRecipes();

  displayRecipes(recipes);
}


function searchRecipes() {

  const searchInput = document.querySelector('.search__input');
  const searchButton = document.querySelector('.search__button');

  searchButton.addEventListener('click', () => {
    console.log(searchInput.value);


    if (searchInput.value !== '' && searchInput.value.length > 2) {

      const filteredRecipes = recipes.filter((recipe) => {
        const searchText = searchInput.value.toLowerCase();
        const nameMatch = recipe.name.toLowerCase().includes(searchText);
        const descriptionMatch = recipe.description.toLowerCase().includes(searchText);
        const ingredientMatch = recipe.ingredients.some((ingredient) => {
          return ingredient.ingredient.toLowerCase().includes(searchText);
        })

        return nameMatch || descriptionMatch || ingredientMatch;
      });

      displayRecipes(filteredRecipes);
    } else {

      displayRecipes(recipes);
    }
  })
}

function displayRecipes(filteredRecipes) {

const recipesSection = document.querySelector('.recipes-container');

  recipesSection.innerHTML = "";

  filteredRecipes.forEach((recipe) => {
    const card = recipeCard(recipe);
    recipesSection.appendChild(card);
  })
}

init();
