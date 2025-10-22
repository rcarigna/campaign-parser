const path = require('path');

module.exports = {
  projects: [
    {
      displayName: 'client',
      rootDir: path.join(__dirname, 'client'),
      ...require('./client/jest.config.cjs'),
    },
  ],
};
