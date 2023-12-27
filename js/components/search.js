function search() {
  const searchInput = document.querySelector(".search__input");
  const crossIcon = document.querySelector(".cross-icon");
  
  searchInput.focus();
  
  crossIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    crossIcon.classList.add("cross-icon-none");
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.length > 0) {
      crossIcon.classList.remove("cross-icon-none");
    } else {
      crossIcon.classList.add("cross-icon-none");
    }
  })
}

export { search };
