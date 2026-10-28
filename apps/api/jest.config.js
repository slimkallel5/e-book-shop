module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  transformIgnorePatterns: ['node_modules/(?!(@nestjs/jwt)/)'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
