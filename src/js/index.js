import { dropdown } from "./components/dropdown.js";
import { search } from "./components/search.js";
import { recipeCard } from "./template/card.js";

const selectedIngredients = [];
const selectedDevices = [];
const selectedUstensils = [];
const newSelectedIngredients = [];
const newSelectedDevices = [];
const newSelectedUstensils = [];
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
  const dropdownIngredientsContent = document.querySelector(
    ".dropdown-1__content__grid"
  );
  const dropdownDevicesContent = document.querySelector(
    ".dropdown-2__content__grid"
  );
  const dropdownUstensilsContent = document.querySelector(
    ".dropdown-3__content__grid"
  );

  const tagContainer = document.querySelector(".tag-container");

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

      if (type === "ingredient") {
        if (selectedIngredients.includes(a.textContent)) {
          selectedIngredients.splice(
            selectedIngredients.indexOf(a.textContent),
            1
          );
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
          } else {
            selectedUstensils.push(tag.textContent);
            tagContainer.appendChild(tag);
          }
        });
        tagContainer.appendChild(tag);
      });

      console.log(filteredRecipes);
      let newResult = filteredRecipes.filter((recipe) => {
        if (selectedIngredients.length > 0) {
          return selectedIngredients.every((ingredient) =>
            recipe.ingredients.some((item) =>
              item.ingredient.toLowerCase().includes(ingredient)
            )
          );
        }
      });

      if (selectedDevices.length > 0) {
        newResult = newResult.filter((recipe) => {
          return selectedDevices.every((device) =>
            recipe.appliance.toLowerCase().includes(device)
          );
        });
      }

      if (selectedUstensils.length > 0) {
        newResult = newResult.filter((recipe) => {
          return selectedUstensils.every((ustensil) =>
            recipe.ustensils.some((item) =>
              item.toLowerCase().includes(ustensil)
            )
          );
        });
      }

      if (
        selectedIngredients.length === 0 &&
        selectedDevices.length === 0 &&
        selectedUstensils.length === 0
      ) {
        newResult = filteredRecipes;
      }

      // advancedSearch(newResult);
      displayRecipes(newResult);
    });

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

  const searchButton = document.querySelector(".search__button");
  searchButton.click();

  const recipesSection = document.querySelector(".recipes-container");
  recipesSection.innerHTML = "";

  const noRecipe = document.createElement("p");
  noRecipe.classList.add("no-recipe");
  noRecipe.textContent = "Aucune recette ne correspond à votre critère...";

  recipesSection.appendChild(noRecipe);

  const newFilter = filteredRecipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      selectedIngredients.includes(ingredient)
    )
  );
  const newFilter2 = newFilter.filter((recipe) =>
    recipe.devices.some((device) => selectedDevices.includes(device))
  );
  const newFilter3 = newFilter2.filter((recipe) =>
    recipe.ustensils.some((ustensil) => selectedUstensils.includes(ustensil))
  );

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
