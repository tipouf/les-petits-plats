import {
  dropdown,
  getDevicesList,
  getIngredientsList,
  getUstensilsList,
} from "./components/dropdown.js";
import { search } from "./components/search.js";
import { recipeCard } from "./template/card.js";
import { normalizeAndLowerCase } from "./utils/utils.js";

// Variables
let selectedIngredients = [];
let selectedDevices = [];
let selectedUstensils = [];
let filteredRecipes = recipes;
let searchText = "";

// DOM
const dropdownIngredientsContent = document.querySelector(".dropdown-1__content__grid");
const dropdownDevicesContent = document.querySelector(".dropdown-2__content__grid");
const dropdownUstensilsContent = document.querySelector(".dropdown-3__content__grid");
const searchInput = document.querySelector(".search__input");
const recipesSection = document.querySelector(".recipes-container");
const filterContainer = document.querySelector(".filter-container");
const tagContainer = document.querySelector(".tag-container");
const numberOfRecipes = document.querySelector(".number-of-recipes");
const crossIcon = document.querySelector(".cross-icon");

function init() {
  dropdown(); // Initialize dropdown
  search(); // Initialize search

  searchRecipes(recipes);
  updateAll(recipes);
}

function reset() {
  selectedIngredients = [];
  selectedDevices = [];
  selectedUstensils = [];
  filteredRecipes = recipes;

  dropdownIngredientsContent.innerHTML = "";
  dropdownDevicesContent.innerHTML = "";
  dropdownUstensilsContent.innerHTML = "";
  tagContainer.innerHTML = "";

  displayRecipes(filteredRecipes);
  updateDropdownList(filteredRecipes);
}

function searchRecipes(recipes) {
  searchInput.addEventListener("input", handleInput);
  crossIcon.addEventListener("click", handleReset);

  function handleInput() {
    reset();
    searchText = searchInput.value.trim().toLowerCase();
    const filteredRecipes = filterRecipes(recipes, searchText);
    const displayStyle = filteredRecipes.length === 0 ? "none" : "flex";
    filterContainer.style.display = displayStyle;
    updateAll(filteredRecipes);
  }

  function handleReset() {
    reset();
    filterContainer.style.display = "flex";
    numberOfRecipesDOM(recipes);
  }
}


/**
 * Filters the array of recipes based on the provided search text.
 *
 * @param {Array} recipes - The array of recipes to filter.
 * @param {string} searchText - The search text used for filtering the recipes.
 * @return {Array} - The filtered array of recipes.
 */
function filterRecipes(recipes, searchText) {
  if (searchText.length <= 2) {
    return recipes;
  }

  const searchTextArray = searchText.split(" ");

  return recipes.filter((recipe) => {
    return searchTextArray.every((text) => {
      return (
        recipe.name.toLowerCase().includes(text) ||
        recipe.description.toLowerCase().includes(text) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(text)
        )
      );
    });
  });
}

const createDropdownItem = (text, type) => {
  const a = document.createElement("a");
  a.setAttribute("tabindex", "0");
  a.setAttribute("data-type", type);
  a.setAttribute("data-value", text);
  a.textContent = text;
  if (
    selectedIngredients.includes(text) ||
    selectedDevices.includes(text) ||
    selectedUstensils.includes(text)
  ) {
    a.classList.add("selected");
  }

  a.addEventListener("click", () => {
    if (type === "ingredient") {
      if (selectedIngredients.includes(a.textContent)) {
        a.classList.remove("selected");
        selectedIngredients.splice(
          selectedIngredients.indexOf(a.textContent),
          1
        );
      } else {
        a.classList.add("selected");
        selectedIngredients.push(a.textContent);
      }
    }

    if (type === "device") {
      if (selectedDevices.includes(a.textContent)) {
        a.classList.remove("selected");
        selectedDevices.splice(selectedDevices.indexOf(a.textContent), 1);
      } else {
        a.classList.add("selected");
        selectedDevices.push(a.textContent);
      }
    }

    if (type === "ustensil") {
      if (selectedUstensils.includes(a.textContent)) {
        a.classList.remove("selected");
        selectedUstensils.splice(selectedUstensils.indexOf(a.textContent), 1);
      } else {
        a.classList.add("selected");
        selectedUstensils.push(a.textContent);
      }
    }

    tagContainer.innerHTML = "";
    selectedIngredients.forEach((ingredient) => {
      const tag = document.createElement("a");
      tag.classList.add("tag");
      tag.textContent = ingredient;
      tag.addEventListener("click", () => {
        if (selectedIngredients.includes(tag.textContent)) {
          selectedIngredients.splice(selectedIngredients.indexOf(tag.textContent),1);
          tagContainer.removeChild(tag);
          const dropdownItem = document.querySelector(`.dropdown-1__content__grid a[data-value="${tag.textContent}"]`);
          dropdownItem.classList.remove("selected");

          // Update dropdown, number of recipes and recipes
          updateAll(getFilteredResults());
        } else {
          selectedIngredients.push(tag.textContent);
          tagContainer.appendChild(tag);
        }
      });
      tagContainer.appendChild(tag);
    });

    selectedDevices.forEach((device) => {
      const tag = document.createElement("a");
      tag.classList.add("tag");
      tag.textContent = device;
      tag.addEventListener("click", () => {
        if (selectedDevices.includes(tag.textContent)) {
          selectedDevices.splice(selectedDevices.indexOf(tag.textContent), 1);
          tagContainer.removeChild(tag);
          const dropdownItem = document.querySelector(`.dropdown-2__content__grid a[data-value="${tag.textContent}"]`);
          dropdownItem.classList.remove("selected");

          // Update dropdown, number of recipes and recipes
          updateAll(getFilteredResults());
        } else {
          selectedDevices.push(tag.textContent);
          tagContainer.appendChild(tag);
        }
      });
      tagContainer.appendChild(tag);
    });

    selectedUstensils.forEach((ustensil) => {
      const tag = document.createElement("a");
      tag.classList.add("tag");
      tag.textContent = ustensil;
      tag.addEventListener("click", () => {
        if (selectedUstensils.includes(tag.textContent)) {
          selectedUstensils.splice(selectedUstensils.indexOf(tag.textContent),1);
          tagContainer.removeChild(tag);
          const dropdownItem = document.querySelector(`.dropdown-3__content__grid a[data-value="${tag.textContent}"]`);
          dropdownItem.classList.remove("selected");

          // Update dropdown, number of recipes and recipes
          updateAll(getFilteredResults());
        } else {
          selectedUstensils.push(tag.textContent);
          tagContainer.appendChild(tag);
        }
      });
      tagContainer.appendChild(tag);
    });

    updateAll(getFilteredResults());
  });

  return a;
};

// Update number of recipes
function numberOfRecipesDOM(recipes) {
  numberOfRecipes.textContent = `${recipes.length} recette${
    recipes.length > 1 ? "s" : ""
  }`;
}

// update dropdown, number of recipes and recipes
function updateAll(results) {
  updateDropdownList(results);
  numberOfRecipesDOM(results);
  displayRecipes(results);
}

// Update dropdown list
function updateDropdownList(list) {
  appendItems(dropdownIngredientsContent, getIngredientsList(list), "ingredient");
  appendItems(dropdownDevicesContent, getDevicesList(list), "device");
  appendItems(dropdownUstensilsContent, getUstensilsList(list), "ustensil");
}

// Append items to dropdown
function appendItems(dropdownContent, items, type) {
  dropdownContent.innerHTML = "";
  items.forEach((item) => {
    dropdownContent.appendChild(createDropdownItem(item, type));
  });

  return dropdownContent;
}

function displayRecipes(recipes) {
  if (recipes.length === 0) {
    recipesSection.innerHTML = "";
    recipesSection.classList.remove("recipes-container");
    const noRecipe = document.createElement("p");
    noRecipe.classList.add("no-recipe");

    noRecipe.textContent = `Aucune recette ne contient "${searchText}", vous pouvez chercher "tarte aux pommes", "poisson", etc...`;
    recipesSection.appendChild(noRecipe);
  } else {
    recipesSection.innerHTML = "";
    recipesSection.classList.add("recipes-container");
    recipes.forEach((recipe) => {
      const card = recipeCard(recipe);
      recipesSection.appendChild(card);
    });
  }
}


/**
 * Filters the results based on the selected ingredients, devices, and ustensils.
 *
 * @return {Array} The filtered recipes.
 */
function getFilteredResults() {
  return filteredRecipes.filter((recipe) => {
    if (
      selectedIngredients.length === 0 &&
      selectedDevices.length === 0 &&
      selectedUstensils.length === 0
    ) {
      return filteredRecipes;
    } else {
      return (
        selectedIngredients.every((ingredient) =>
          recipe.ingredients.some(
            (recipeIngredient) =>
              normalizeAndLowerCase(recipeIngredient.ingredient) ===
              normalizeAndLowerCase(ingredient)
          )
        ) &&
        selectedDevices.every(
          (device) =>
            normalizeAndLowerCase(recipe.appliance) ===
            normalizeAndLowerCase(device)
        ) &&
        selectedUstensils.every((ustensil) =>
          recipe.ustensils.some(
            (recipeUstensil) =>
              normalizeAndLowerCase(recipeUstensil) ===
              normalizeAndLowerCase(ustensil)
          )
        )
      );
    }
  });
}

init();
