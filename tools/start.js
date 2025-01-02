import chokidar from 'chokidar'
import { exec } from 'child_process'
import logger from '../src/utils/logger'

// #todo - add anything useful referencing toi-spa's start.js

async function start() {
  // #todo -- if exec failed , then it should print error on console . logger.scucess should not run in that case
  exec('http-server ./dist -g --cors -p 9001 --open')
  logger.success(' ***** Dev server started at port 9001 ***** ')
  // Initialize watcher.
  const watcher = chokidar.watch('src', { persistent: true })
  // Add event listeners.
  let processing = false

  watcher.on('change', () => {
    if (!processing) {
      processing = true
      logger.highlight(' ***** Re-building for dev server ***** ')
      exec('yarn run build', (error, stdout) => {
        if (error) logger.failure('error', error)
        processing = false
        logger.log('stdout', stdout)
        logger.success(' **** Re-building Complete ****')
      })
    }
  })
}

export default start
