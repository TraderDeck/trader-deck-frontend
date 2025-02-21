export const toSnakeCase = (str: string) =>
 str.toLowerCase().replace(/\s+/g, "_");


export const toCamelCase = (str: string) => {
    const newStr = str
      .replace(/\s(.)/g, (match) => match.toUpperCase()) // Capitalize letters after spaces
      .replace(/\s/g, "") // Remove spaces
      .replace(/^(.)/, (match) => match.toLowerCase()); // Ensure first letter is lowercase
      return newStr;
}