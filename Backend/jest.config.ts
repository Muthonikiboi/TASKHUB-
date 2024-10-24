module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use Node.js environment for Express
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transpile TypeScript files with ts-jest
  },
  moduleDirectories: ['node_modules', 'src'], // Ensure Jest looks for modules in the correct places
};
