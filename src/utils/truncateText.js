function truncateText(str, maxChars) {
  return str.length > maxChars ? ` ${str.substring(0, maxChars - 3)} ...` : str
}

export default truncateText
