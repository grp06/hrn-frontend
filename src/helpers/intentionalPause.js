const intentionalPause = (milliseconds) => {
  const now = new Date()
  while (new Date() - now <= milliseconds) {
    /* Do nothing */
  }
}

export default intentionalPause
