import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.aliases.json'

function getWebpackAliasesFromPaths(configPaths: { [key: string]: string[] }) {
  return Object.entries(configPaths).reduce(
    (webpackAliases, [configAlias, configPathList]) => {
      const [aliasKey] = configAlias.split('/');
      const [relativePathToDir] = configPathList[0].split('/*');
      return {
        ...webpackAliases,
        [aliasKey]: path.resolve(__dirname, relativePathToDir),
      };
    },
    {},
  );
}

export default {
  jest: {
    configure: {
      bail: true,
      verbose: true,
      roots: ['<rootDir>'],
      modulePaths: [compilerOptions.baseUrl],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    },
  },
  webpack: {
    alias: getWebpackAliasesFromPaths(compilerOptions.paths),
  },
}
