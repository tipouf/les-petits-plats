const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeAndLowerCase = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .charAt(0)
    .toUpperCase() + str.slice(1);

export { removeAccents, normalizeAndLowerCase };

const stringCapitalize = (str) =>
  str
    
