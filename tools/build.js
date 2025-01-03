import run from './run'
import clean from './clean'
import copy from './copy'
import bundle from './bundle'
import deploy from './deploy'

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (dist) folder.
 */
async function build() {
  await run(clean)
  await run(copy)
  await run(bundle)
  await run(deploy)
}

export default build
