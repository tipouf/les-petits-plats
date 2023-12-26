const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const normalizeAndLowerCase = (str) => {
  const normalizedStr = str.normalize("NFD").toLowerCase();
  const firstLetter = normalizedStr.charAt(0).toUpperCase();
  const restOfString = normalizedStr.slice(1);
  return firstLetter + restOfString;
};

export { removeAccents, normalizeAndLowerCase };

const stringCapitalize = (str) =>
  str
    
