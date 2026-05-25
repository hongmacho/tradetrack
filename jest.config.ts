import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node',
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/db$': '<rootDir>/__tests__/helpers/testDb.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'lib/utils.ts',
    'lib/validations/**/*.ts',
    'repositories/**/*.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
}

export default config
