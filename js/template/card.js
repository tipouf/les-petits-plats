function recipeCard(recipe) {
  const card = document.createElement("article");
  card.classList.add("card");
  card.setAttribute("tabindex", "0");
  card.innerHTML = `
  <img src="./assets/images/${recipe.image}" alt="${recipe.name}" />
  <div class="card__time">${recipe.time}min</div>
  <div class="card__content">
    <h2 class="card__content__title">${recipe.name}</h2>
    <div class="card__content__recipe">
      <h3 class="card__content__recipe__title">RECETTE</h3>
      <span class="card__content__recipe__description">
        ${recipe.description}
      </span>
    </div>
    <div class="card__content__ingredient">
      <h3 class="card__content__ingredient__title">INGREDIENTS</h3>
      <div class="card__content__ingredient__grid">
        ${recipe.ingredients
          .map(
            (ingredient, index) => `
          <div class="card__content__ingredient__grid__item">
            <span class="card__content__ingredient__grid__item__title">${
              ingredient?.ingredient || ""
            }</span>
            <span class="card__content__ingredient__grid__item__quantity">${
              ingredient?.quantity || ""
            }${ingredient?.unit ? ` ${ingredient.unit}` : ""}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </div>
`;

  return card;
}

export { recipeCard };
