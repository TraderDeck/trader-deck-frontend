export const toSnakeCase = (str: string) =>
 str.toLowerCase().replace(/\s+/g, "_");


export const toCamelCase = (str: string) => {
    const newStr = str
      .replace(/\s(.)/g, (match) => match.toUpperCase()) 
      .replace(/\s/g, "") 
      .replace(/^(.)/, (match) => match.toLowerCase()); 
      return newStr;
}