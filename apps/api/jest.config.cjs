const base = require('../../jest.config.cjs').projects[0];
module.exports = { ...base, rootDir: '.', coverageDirectory: '../..//coverage/api' };
