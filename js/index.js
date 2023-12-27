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
let filteredRecipes = [];
let searchText = "";

// DOM
const dropdownIngredientsContent = document.querySelector(
  ".dropdown-1__content__grid"
);
const dropdownDevicesContent = document.querySelector(
  ".dropdown-2__content__grid"
);
const dropdownUstensilsContent = document.querySelector(
  ".dropdown-3__content__grid"
);
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
  advancedSearch(recipes);
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
  const searchText = searchInput.value.toLowerCase();
  const filteredRecipes = filterRecipes(recipes, searchText);
  const displayStyle = filteredRecipes.length === 0 ? "none" : "flex";
  filterContainer.style.display = displayStyle;
  advancedSearch(filteredRecipes);
}

  function handleReset() {
    reset();
    filterContainer.style.display = "flex";
    numberOfRecipesDOM(recipes);
  }
}

// filter recipes based on searchInput
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

// advanced filter
function advancedSearch(recipes) {
  filteredRecipes = recipes;

  recipesSection.innerHTML = "";

  const noRecipe = document.createElement("p");
  noRecipe.classList.add("no-recipe");
  noRecipe.textContent = "Aucune recette ne correspond à votre critère...";

  recipesSection.appendChild(noRecipe);

  updateDropdownList(filteredRecipes);
  numberOfRecipesDOM(filteredRecipes);
  displayRecipes(filteredRecipes);
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
          selectedIngredients.splice(
            selectedIngredients.indexOf(tag.textContent),
            1
          );
          tagContainer.removeChild(tag);
          const dropdownItem = document.querySelector(
            `.dropdown-1__content__grid a[data-value="${tag.textContent}"]`
          );
          dropdownItem.classList.remove("selected");

          // Update dropdown, number of recipes and recipes
          updateDropdownList(getFilteredResults());
          numberOfRecipesDOM(getFilteredResults());
          displayRecipes(getFilteredResults());
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
          const dropdownItem = document.querySelector(
            `.dropdown-2__content__grid a[data-value="${tag.textContent}"]`
          );
          dropdownItem.classList.remove("selected");

          // Update dropdown, number of recipes and recipes
          updateDropdownList(getFilteredResults());
          numberOfRecipesDOM(getFilteredResults());
          displayRecipes(getFilteredResults());
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
          selectedUstensils.splice(
            selectedUstensils.indexOf(tag.textContent),
            1
          );
          tagContainer.removeChild(tag);
          const dropdownItem = document.querySelector(
            `.dropdown-3__content__grid a[data-value="${tag.textContent}"]`
          );
          dropdownItem.classList.remove("selected");
 
          // Update dropdown, number of recipes and recipes
          updateDropdownList(getFilteredResults());
          numberOfRecipesDOM(getFilteredResults());
          displayRecipes(getFilteredResults());
        } else {
          selectedUstensils.push(tag.textContent);
          tagContainer.appendChild(tag);
        }
      });
      tagContainer.appendChild(tag);
    });

    // Update dropdown, number of recipes and recipes
    updateDropdownList(getFilteredResults());
    numberOfRecipesDOM(getFilteredResults());
    displayRecipes(getFilteredResults());
  });

  return a;
};

// Update number of recipes
function numberOfRecipesDOM(recipes) {
  numberOfRecipes.textContent = `${recipes.length} recette${
    recipes.length > 1 ? "s" : ""
  }`;
}

// Handle tag click and update dropdown list
function handleTagClick(tag, selectedArray, dropdownQuery) {
  if (selectedArray.includes(tag.textContent)) {
    selectedArray.splice(selectedArray.indexOf(tag.textContent), 1);
    tagContainer.removeChild(tag);
    const dropdownItem = document.querySelector(
      `${dropdownQuery} a[data-value="${tag.textContent}"]`
    );
    dropdownItem.classList.remove("selected");
  } else {
    selectedArray.push(tag.textContent);
    tagContainer.appendChild(tag);
  }

  updateDropdownList(getFilteredResults());
  numberOfRecipesDOM(getFilteredResults());
  displayRecipes(getFilteredResults());
}

// Update dropdown list
function updateDropdownList(list) {
  appendItems(dropdownIngredientsContent, getIngredientsList(list),"ingredient");
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

// Get filtered results
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
