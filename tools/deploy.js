import path from 'path'
import { spawn } from './lib/cp'
import logger from '../src/utils/logger'

const options = {
  cwd: path.resolve(__dirname, '../'),
  stdio: ['ignore', 'inherit', 'inherit'],
}

// #todo : use latest aws-sdk and fs to upload dist folder instead of s3-deploy
// s3 deploy has some very old dependencies which are no longer supported

/**
 * Deploy the contents of the `/build` folder to a Amazon S3
 */
async function deploy() {
  if (process.argv.includes('--production')) {
    // production path on s3
    // "deploy-to-s3-staging": "s3-deploy './dist/**' --cwd './dist/' --bucket toiassets --gzip --filePrefix tui/library",
    logger.log('Uploading production assets')
    await spawn(
      's3-deploy',
      [
        './dist/**',
        '--cwd',
        './dist/',
        '--bucket',
        'toiassets',
        '--region',
        'ap-southeast-1',
        '--gzip',
        '--filePrefix',
        'tui/library',
      ],
      options
    )
    logger.log('Production assets uploaded successfully')
  } else if (process.argv.includes('--staging')) {
    // staging path on s3
    // "deploy-to-s3-production": "s3-deploy './dist/**' --cwd './dist/' --bucket toiassets --gzip --filePrefix tui/library/staging"
    logger.log('Uploading staging assets')
    await spawn(
      's3-deploy',
      [
        './dist/**',
        '--cwd',
        './dist/',
        '--bucket',
        'toiassets',
        '--region',
        'ap-southeast-1',
        '--gzip',
        '--filePrefix',
        'tui/library/staging',
      ],
      options
    )
    logger.log('Staging assets uploaded successfully')
  }
}

export default deploy
