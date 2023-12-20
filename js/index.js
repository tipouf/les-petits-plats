import {
  dropdown,
  getDevicesList,
  getIngredientsList,
  getUstensilsList,
} from "./components/dropdown.js";
import { search } from "./components/search.js";
import { recipeCard } from "./template/card.js";
import { normalizeAndLowerCase } from "./utils/utils.js";
let selectedIngredients = [];
let selectedDevices = [];
let selectedUstensils = [];
let filteredRecipes = [];
let advancedSearchResults = [];

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

const tagContainer = document.querySelector(".tag-container");
const filterContainer = document.querySelector(".filter-container");

const numberOfRecipes = document.querySelector(".number-of-recipes");

function reset() {
  selectedIngredients = [];
  selectedDevices = [];
  selectedUstensils = [];
  filteredRecipes = recipes;

  displayRecipes(filteredRecipes);

  dropdownIngredientsContent.innerHTML = "";
  dropdownDevicesContent.innerHTML = "";
  dropdownUstensilsContent.innerHTML = "";

  appendItems(
    dropdownIngredientsContent,
    getIngredientsList(filteredRecipes),
    "ingredient"
  );

  appendItems(
    dropdownDevicesContent,
    getDevicesList(filteredRecipes),
    "device"
  );

  appendItems(
    dropdownUstensilsContent,
    getUstensilsList(filteredRecipes),
    "ustensil"
  );

  tagContainer.innerHTML = "";
}

function init() {
  dropdown(); // Initialize dropdown
  search(); // Initialize search

  searchRecipes(recipes);
  advancedSearch(recipes);
}

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

function advancedSearch(recipes) {
  filteredRecipes = recipes;

  dropdownIngredientsContent.innerHTML = "";
  dropdownDevicesContent.innerHTML = "";
  dropdownUstensilsContent.innerHTML = "";

  appendItems(
    dropdownIngredientsContent,
    getIngredientsList(filteredRecipes),
    "ingredient"
  );
  appendItems(
    dropdownDevicesContent,
    getDevicesList(filteredRecipes),
    "device"
  );
  appendItems(
    dropdownUstensilsContent,
    getUstensilsList(filteredRecipes),
    "ustensil"
  );

  const recipesSection = document.querySelector(".recipes-container");
  recipesSection.innerHTML = "";

  const noRecipe = document.createElement("p");
  noRecipe.classList.add("no-recipe");
  noRecipe.textContent = "Aucune recette ne correspond à votre critère...";

  recipesSection.appendChild(noRecipe);
  numberOfRecipesDOM(filteredRecipes);
  displayRecipes(filteredRecipes);
}

const createDropdownItem = (text, type) => {
  const tagContainer = document.querySelector(".tag-container");
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
          displayRecipes(getFilteredResults());
        } else {
          selectedUstensils.push(tag.textContent);
          tagContainer.appendChild(tag);
        }
      });
      tagContainer.appendChild(tag);
    });

    advancedSearchResults = getFilteredResults();

    appendItems(
      dropdownIngredientsContent,
      getIngredientsList(advancedSearchResults),
      "ingredient"
    );
    appendItems(
      dropdownDevicesContent,
      getDevicesList(advancedSearchResults),
      "device"
    );
    appendItems(
      dropdownUstensilsContent,
      getUstensilsList(advancedSearchResults),
      "ustensil"
    );

    numberOfRecipesDOM(advancedSearchResults);
    displayRecipes(advancedSearchResults);
  });

  return a;
};

function appendItems(dropdownContent, items, type) {
  dropdownContent.innerHTML = "";
  items.forEach((item) => {
    dropdownContent.appendChild(createDropdownItem(item, type));
  });

  return dropdownContent;
}

function numberOfRecipesDOM(recipes) {
  numberOfRecipes.textContent = `${recipes.length} recette${
    recipes.length > 1 ? "s" : ""
  }`;
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
