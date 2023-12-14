import { dropdown } from "./components/dropdown.js";
import { search } from "./components/search.js";
import { recipeCard } from "./template/card.js";

const selectedIngredients = [];
const selectedDevices = [];
const selectedUstensils = [];
function init() {
  dropdown();
  search();

  searchRecipes(recipes);
  advancedSearch(recipes);
  displayRecipes(recipes);
}

function searchRecipes(recipes) {
  const searchInput = document.querySelector(".search__input");
  const searchButton = document.querySelector(".search__button");
  let filteredRecipes = [];

  searchInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      const searchText = event.target.value.toLowerCase();
      filteredRecipes = filterRecipes(recipes, searchText);
      searchButton.click();
    }
  });

  searchButton.addEventListener("click", () => {
    const searchText = searchInput.value.toLowerCase();
    filteredRecipes = filterRecipes(recipes, searchText);

    advancedSearch(filteredRecipes);

    displayRecipes(filteredRecipes);
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

function advancedSearch(filteredRecipes) {
  const dropdownIngredientsContent = document.querySelector(".dropdown-1__content__grid");
  const dropdownDevicesContent = document.querySelector(".dropdown-2__content__grid");
  const dropdownUstensilsContent = document.querySelector(".dropdown-3__content__grid");

  const normalizeAndLowerCase = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase(); // convert to lowercase

  const ingredients = filteredRecipes.flatMap((recipe) =>
    recipe.ingredients.map(({ ingredient }) =>
      normalizeAndLowerCase(ingredient)
    )
  );
  const devices = filteredRecipes.map(({ appliance }) =>
    normalizeAndLowerCase(appliance)
  );
  const ustensils = filteredRecipes.flatMap((recipe) =>
    recipe.ustensils.map((ustensil) => normalizeAndLowerCase(ustensil))
  );

  const uniqueIngredients = [...new Set(ingredients.sort())]; // remove duplicates and sort
  const uniqueDevices = [...new Set(devices.sort())];
  const uniqueUstensils = [...new Set(ustensils.sort())];



  dropdownIngredientsContent.innerHTML = "";
  dropdownDevicesContent.innerHTML = "";
  dropdownUstensilsContent.innerHTML = "";

  const createDropdownItem = (text, type) => {
    const a = document.createElement("a");
    a.textContent = text;

    a.addEventListener("click", () => {
      a.classList.toggle("selected");
      console.log(a.textContent);

      console.log("type", type);

      if (type === "ingredient") {
        if (selectedIngredients.includes(a.textContent)) {
          selectedIngredients.splice(selectedIngredients.indexOf(a.textContent), 1);

        } else {
          selectedIngredients.push(a.textContent);
        }
      }

      if (type === "device") {
        if (selectedDevices.includes(a.textContent)) {
          selectedDevices.splice(selectedDevices.indexOf(a.textContent), 1);
        } else {
          selectedDevices.push(a.textContent);
        }
      }

      if (type === "ustensil") {
        if (selectedUstensils.includes(a.textContent)) {
          selectedUstensils.splice(selectedUstensils.indexOf(a.textContent), 1);
        } else {
          selectedUstensils.push(a.textContent);
        }
      }

    })
    return a;
  };

  const apendItems = (dropdownContent, items, type) => {
    items.forEach((item) => {
      dropdownContent.appendChild(createDropdownItem(item, type));

    });

    return dropdownContent;
  };

  apendItems(dropdownIngredientsContent, uniqueIngredients, "ingredient");
  apendItems(dropdownDevicesContent, uniqueDevices, "device");
  apendItems(dropdownUstensilsContent, uniqueUstensils, "ustensil");

  const dropdownBtnIngredients = document.querySelector(".dropdown-1__btn");
  const dropdownBtnDevices = document.querySelector(".dropdown-2__btn");
  const dropdownBtnUstensils = document.querySelector(".dropdown-3__btn");

  dropdownBtnIngredients.click();
  dropdownBtnDevices.click();
  dropdownBtnUstensils.click();

  // const searchInput = document.querySelector(".search__input > span");
  // searchInput.value = "";


  const searchButton = document.querySelector(".search__button");
  searchButton.click();

  const recipesSection = document.querySelector(".recipes-container");
  recipesSection.innerHTML = "";

  const noRecipe = document.createElement("p");
  noRecipe.classList.add("no-recipe");
  noRecipe.textContent = "Aucune recette ne correspond à votre critère...";

  recipesSection.appendChild(noRecipe);

  return filteredRecipes;
}
function displayRecipes(filteredRecipes) {
  const recipesSection = document.querySelector(".recipes-container");

  if (filteredRecipes.length === 0) {
    recipesSection.innerHTML = "";
    const noRecipe = document.createElement("p");
    noRecipe.classList.add("no-recipe");
    noRecipe.textContent = "Aucune recette ne correspond à votre critère...";
    recipesSection.appendChild(noRecipe);
  } else {
    recipesSection.innerHTML = "";

    filteredRecipes.forEach((recipe) => {
      const card = recipeCard(recipe);
      recipesSection.appendChild(card);
    });
  }
}

init();

export { displayRecipes, advancedSearch, searchRecipes };
