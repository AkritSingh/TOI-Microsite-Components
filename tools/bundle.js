import webpack from 'webpack'
import path from 'path'
import webpackConfig from '../webpack.config'
import { readDir } from './lib/fs'

const { ModuleFederationPlugin } = require('webpack').container

const ROOT_DIR = path.resolve(__dirname, '../')

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  const ModuleFederationOptions = {
    name: 'toi-microsite-library',
    filename: 'remoteEntry.js',
  }

  return new Promise((resolve, reject) => {
    const componentPromises = []
    let exposedModules = {}

    componentPromises.push(
      readDir(`src/components/**/package.json`).then(
        (componentPackagePaths) => {
          componentPackagePaths.forEach((componentPackagePath) => {
            componentPromises.push(
              import(path.resolve(ROOT_DIR, componentPackagePath)).then(
                (componentPackage) => {
                  // if any component needs to be excluded from standalone build
                  // even though the component present in standalone category folder
                  if (!componentPackage.exposed) {
                    return
                  }
                  const versionSuffix = componentPackage.version.split('.')[0]
                    ? `-v${componentPackage.version.split('.')[0]}`
                    : ''
                  exposedModules = {
                    ...exposedModules,
                    [`./${componentPackage.name}${versionSuffix}`]:
                      path.resolve(
                        ROOT_DIR,
                        componentPackagePath.replace(
                          'package.json',
                          componentPackage.main.replace('./', '')
                        )
                      ),
                  }
                }
              )
            )
          })
        }
      )
    )

    Promise.all(componentPromises).then(() => {
      const finalConfig = { ...webpackConfig }

      ModuleFederationOptions.exposes = exposedModules

      finalConfig.plugins.push(
        new ModuleFederationPlugin(ModuleFederationOptions)
      )

      webpack(finalConfig).run((err, stats) => {
        if (err) {
          return reject(err)
        }

        console.info(stats.toString(webpackConfig.stats))
        if (stats.hasErrors()) {
          return reject(new Error('Webpack compilation errors'))
        }

        return resolve()
      })
    })
  })
}

export default bundle
