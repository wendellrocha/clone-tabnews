const nextJest = require("next/jest");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
  reporters: ["default", "jest-sonar"],
});

module.exports = jestConfig;
