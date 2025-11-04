const { join } = require('path');

module.exports = {
  projects: [
    {
      displayName: 'client',
      rootDir: join(__dirname, 'client'),
      ...require('./client/jest.config.cjs'),
    },
    {
      displayName: 'server',
      rootDir: join(__dirname, 'server'),
      ...require('./server/jest.config.js'),
    },
  ],
};
