const isAmpMessage = (event, type) =>
  event.source === window.parent &&
  event.origin !== window.location.origin &&
  event.data &&
  event.data.sentinel === 'amp' &&
  event.data.type === type

const observe = ({ inViewCallback = () => {}, doNotUnobserve = false }) => {
  // ask parent amp page to send intersection events
  window.parent.postMessage(
    {
      sentinel: 'amp',
      type: 'send-intersections',
    },
    '*'
  )

  const onMessage = (event) => {
    if (!isAmpMessage(event, 'intersection')) {
      return
    }

    event.data.changes.forEach(({ intersectionRatio }) => {
      if (intersectionRatio > 0) {
        inViewCallback()
        if (!doNotUnobserve) {
          window.removeEventListener('message', onMessage)
        }
      }
    })
  }

  window.addEventListener('message', onMessage)
}

export default {
  observe,
}
