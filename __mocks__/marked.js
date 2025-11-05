// Mock marked function for Jest - returns simplified HTML
const marked = jest.fn((content) => {
  // Convert basic markdown to HTML for testing
  return content
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        const level = (trimmed.match(/^#+/) || [''])[0].length;
        const text = trimmed.replace(/^#+\s*/, '');
        return `<h${level}>${text}</h${level}>`;
      } else if (trimmed) {
        return `<p>${trimmed}</p>`;
      }
      return '';
    })
    .filter(Boolean)
    .join('');
});

module.exports = { marked };
