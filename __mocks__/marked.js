// Mock for marked library - supports both old and new API
const markdownToHtml = (input) => {
  // Simple mock that converts basic markdown to HTML
  return Promise.resolve(
    input
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>')
  );
};

// Function API (old marked usage: marked(content))
const marked = jest.fn(markdownToHtml);

// Object API (new marked usage: marked.parse(content))
marked.parse = jest.fn(markdownToHtml);

module.exports = { marked };
