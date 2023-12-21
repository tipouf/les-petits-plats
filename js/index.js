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
const searchButton = document.querySelector(".search__button");
const crossIcon = document.querySelector(".cross-icon");
const recipesSection = document.querySelector(".recipes-container");
const filterContainer = document.querySelector(".filter-container");
const tagContainer = document.querySelector(".tag-container");
const numberOfRecipes = document.querySelector(".number-of-recipes");

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

// main search
function searchRecipes(recipes) {
  searchInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      const searchText = event.target.value.toLowerCase();
      filteredRecipes = filterRecipes(recipes, searchText);
      reset();
      searchButton.click();
    }
  });

  searchButton.addEventListener("click", () => {
    reset();
    const searchText = searchInput.value.toLowerCase();
    filteredRecipes = filterRecipes(recipes, searchText);
    if (filteredRecipes.length === 0) {
      filterContainer.style.display = "none";
    } else {
      filterContainer.style.display = "flex";
    }
    advancedSearch(filteredRecipes);
  });
}

// main filter
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
  a.setAttribute("data-value", text);
  a.textContent = text;

  let selectedArray;

  if (type === "ingredient") {
    selectedArray = selectedIngredients;
  } else if (type === "device") {
    selectedArray = selectedDevices;
  } else if (type === "ustensil") {
    selectedArray = selectedUstensils;
  } else {
    selectedArray = [];
  }

  if (selectedArray.includes(text)) {
    a.classList.add("selected");
  }

  a.addEventListener("click", () => {
    let selectedArray;
    if (type === "ingredient") {
      selectedArray = selectedIngredients;
    } else if (type === "device") {
      selectedArray = selectedDevices;
    } else if (type === "ustensil") {
      selectedArray = selectedUstensils;
    } else {
      selectedArray = [];
    }

    // Check if the item is already selected
    if (selectedArray.includes(a.textContent)) {
      a.classList.remove("selected");
      selectedArray.splice(selectedArray.indexOf(a.textContent), 1);
    } else {
      a.classList.add("selected");
      selectedArray.push(a.textContent);
    }

    tagContainer.innerHTML = "";

    selectedArray.forEach((item) => {
      const tag = document.createElement("a");
      tag.classList.add("tag");
      tag.textContent = item;
      tag.addEventListener("click", () => {
        let dropdownClassName;
        if (type === "ingredient") {
          dropdownClassName = ".dropdown-1__content__grid";
        } else if (type === "device") {
          dropdownClassName = ".dropdown-2__content__grid";
        } else {
          dropdownClassName = ".dropdown-3__content__grid";
        }
        handleTagClick(tag, selectedArray, dropdownClassName);
      });
      tagContainer.appendChild(tag);
    });

    updateDropdownList(getFilteredResults());
    numberOfRecipesDOM(getFilteredResults());
    displayRecipes(getFilteredResults());
  });

  return a;
};

function numberOfRecipesDOM(recipes) {
  numberOfRecipes.textContent = `${recipes.length} recette${
    recipes.length > 1 ? "s" : ""
  }`;
}

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

function updateDropdownList(list) {
  appendItems(
    dropdownIngredientsContent,
    getIngredientsList(list),
    "ingredient"
  );
  appendItems(dropdownDevicesContent, getDevicesList(list), "device");
  appendItems(dropdownUstensilsContent, getUstensilsList(list), "ustensil");
}

function appendItems(dropdownContent, items, type) {
  dropdownContent.innerHTML = "";
  items.forEach((item) => {
    dropdownContent.appendChild(createDropdownItem(item, type));
  });

  return dropdownContent;
}

function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes-container");

  if (recipes.length === 0) {
    recipesSection.innerHTML = "";
    const noRecipe = document.createElement("p");
    noRecipe.classList.add("no-recipe");
    noRecipe.textContent = "Aucune recette ne correspond à votre critère...";
    recipesSection.appendChild(noRecipe);
  } else {
    recipesSection.innerHTML = "";

    recipes.forEach((recipe) => {
      const card = recipeCard(recipe);
      recipesSection.appendChild(card);
    });
  }
}

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
