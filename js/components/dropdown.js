import { removeAccents, normalizeAndLowerCase } from "../utils/utils.js";


export function dropdown() {
  const dropdownBtnIngredients = document.querySelector(".dropdown-1__btn-container");
  const dropdownBtnDevices = document.querySelector(".dropdown-2__btn-container");
  const dropdownBtnUstensils = document.querySelector(".dropdown-3__btn-container");
  const dropdownDevicesContent = document.querySelector(".dropdown-2__content");
  const deleteSearchInputIngredients = document.querySelector(".dropdown-1__content__inputContainer__crossIcon");
  const deleteSearchInputDevices = document.querySelector(".dropdown-2__content__inputContainer__crossIcon");
  const deleteSearchInputUstensils = document.querySelector(".dropdown-3__content__inputContainer__crossIcon");

  const dropdownUstensilsContent = document.querySelector(
    ".dropdown-3__content"
  );
  const dropdownIngredientsContent = document.querySelector(
    ".dropdown-1__content"
  );
  const ingredientInput = document.querySelector("#myIngredientInput");
  const deviceInput = document.querySelector("#myDeviceInput");
  const ustensilInput = document.querySelector("#myUstensilInput");
  const angleIcon1 = document.querySelector("#angleIcon1");
  const angleIcon2 = document.querySelector("#angleIcon2");
  const angleIcon3 = document.querySelector("#angleIcon3");

  dropdownBtnIngredients.addEventListener("click", () =>
    toggleDropdown(dropdownIngredientsContent, angleIcon1)
  );
  ingredientInput.addEventListener("keyup", (event) =>
    filterDropdown(event, dropdownIngredientsContent, ".dropdown-1__content a", deleteSearchInputIngredients)
  );

  dropdownBtnDevices.addEventListener("click", () =>
    toggleDropdown(dropdownDevicesContent, angleIcon2)
  );
  deviceInput.addEventListener("keyup", (event) =>
    filterDropdown(event, dropdownDevicesContent, ".dropdown-2__content a", deleteSearchInputDevices)
  );

  dropdownBtnUstensils.addEventListener("click", () =>
    toggleDropdown(dropdownUstensilsContent, angleIcon3)
  );
  ustensilInput.addEventListener("keyup", (event) =>
    filterDropdown(event, dropdownUstensilsContent, ".dropdown-3__content a", deleteSearchInputUstensils)
  );
}

function toggleDropdown(dropdownContent, angleIcon) {
  dropdownContent.classList.toggle("show");
  if (angleIcon.classList.contains("rotate180")) {
    angleIcon.classList.add("rotate0");
    angleIcon.classList.remove("rotate180");
  } else {
    angleIcon.classList.remove("rotate0");
    angleIcon.classList.add("rotate180");
  }
}

function filterDropdown(event, dropdownContent, selector, crossIcon) {

  const filter = event.target.value.toUpperCase();

  if (filter === "") {
    crossIcon.classList.add("cross-icon-none");
  } else {
    crossIcon.classList.remove("cross-icon-none");
  }

  crossIcon.addEventListener("click", () => {
    event.target.value = "";
    filterDropdown(event, dropdownContent, selector, crossIcon);
  })

  const links = dropdownContent.querySelectorAll(selector);

  links.forEach((link) => {
    const txtValue = link.textContent;
    link.style.display =
      removeAccents(txtValue).toUpperCase().indexOf(filter) > -1 ? "" : "none";
  });
}

const getIngredientsList = (list) =>[...new Set(
  list.flatMap((recipe) =>
    recipe.ingredients.map(({ ingredient }) =>
      normalizeAndLowerCase(ingredient)
    )
  )
)];

const getDevicesList = (list) =>[...new Set(
  list.map(({ appliance }) =>
    normalizeAndLowerCase(appliance)
  )
)];

const getUstensilsList = (list) =>[...new Set(
  list.flatMap((recipe) =>
    recipe.ustensils.map((ustensil) => normalizeAndLowerCase(ustensil))
  )
)]

export { getIngredientsList, getDevicesList, getUstensilsList }