import { makeDir } from './lib/fs'

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  // #todo : how does it know to create in root folder
  await makeDir('dist')
  // copyDir('samples', 'dist')
}

export default copy
