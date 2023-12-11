function search() {
  const searchButton = document.querySelector(".search__button");
  const searchInput = document.querySelector(".search__input");
  const crossIcon = document.querySelector(".cross-icon");

  searchInput.focus();

  searchButton.addEventListener("click", () => {
    console.log("search", searchInput.value);

    if (searchInput.value !== "") {
      crossIcon.classList.remove("cross-icon-none");
    } else {
      crossIcon.classList.add("cross-icon-none");
    }
  });

  crossIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    crossIcon.classList.add("cross-icon-none");
  })
}



export { search };
