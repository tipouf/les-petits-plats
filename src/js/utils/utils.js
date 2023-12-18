const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeAndLowerCase = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase(); // convert to lowercase




    export { removeAccents, normalizeAndLowerCase };


