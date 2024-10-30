export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs'],
  extensionsToTreatAsEsm: ['.js'],
  rootDir: './',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
};