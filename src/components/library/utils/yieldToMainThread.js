const yieldToMainThread = async () => {
  if ('scheduler' in window && 'yield' in window.scheduler) {
    return window.scheduler.yield();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};
export default yieldToMainThread;
