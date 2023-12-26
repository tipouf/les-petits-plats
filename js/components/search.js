function search() {
  const searchButton = document.querySelector(".search__button");
  const searchInput = document.querySelector(".search__input");
  const crossIcon = document.querySelector(".cross-icon");

  searchInput.focus();
  
  searchButton.addEventListener("click", () => {
    crossIcon.classList.toggle("cross-icon-none", searchInput.value === "");
  });

  crossIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    crossIcon.classList.add("cross-icon-none");
    searchButton.click();
  });
}

export { search };
