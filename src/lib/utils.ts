export const capitalize = (word: string) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
};

// Highlight search matches
export function highlightMatches(text: string, query: string) {
  if (!query || typeof text !== 'string') {
    return text;
  }

  const re = new RegExp(`${query}`, 'gi');

  return text.replace(
    re,
    (match) =>
      `<mark class="underline underline-offset-2 font-semibold text-inherit bg-transparent">${match}</mark>`,
  );
}
