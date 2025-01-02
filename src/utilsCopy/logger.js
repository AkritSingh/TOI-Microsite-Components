// import { green, red, yellow } from 'chalk'

export default {
  log: (...messages) => {
    console.log(...messages)
  },
  error: (...messages) => {
    console.error('TUI Library - Error:', ...messages)
  },
  warn: (...messages) => {
    console.warn('TUI Library - Warning:', ...messages)
  },

  success: (...messages) => {
    console.log('TUI Library - Success:', ...messages)
  },
  failure: (...messages) => {
    console.log('TUI Library - Failure:', ...messages)
  },
  highlight: (...messages) => {
    console.log('TUI Library - Highlight:', ...messages)
  },

  // node colorful consoles
  // success: (...messages) => {
  //   console.log(green(...messages))
  // },
  // failure: (...messages) => {
  //   console.log(red(...messages))
  // },
  // highlight: (...messages) => {
  //   console.log(yellow(...messages))
  // },
}
