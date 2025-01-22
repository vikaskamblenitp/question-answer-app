/**
 * Cleans the input text to ensure it is safe for use in a template string.
 * - Escapes curly braces, dollar signs, and backslashes.
 * - Removes or normalizes invalid or problematic characters.
 * - Collapses excessive whitespace and removes control characters.
 * 
 * @param {string} text - The input text to clean.
 * @returns {string} - The sanitized text.
 */
export const sanitizeText = (text: string) => {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }

  return text
    .replace(/[{}]/gu, "") // Remove curly braces
    .replace(/\$/gu, "\\$") // Escape dollar signs
    .replace(/\\/gu, "\\\\") // Escape backslashes
    .replace(/[\x00-\x1F\x7F]/gu, "") // Remove control characters
    .replace(/\s+/gu, " ") // Collapse multiple spaces into one
    .trim(); // Remove leading and trailing whitespace
}