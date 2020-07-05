// const sleep = (milliseconds) => {
//   const now = new Date()
//   while (new Date() - now <= milliseconds) {
//     /* Do nothing */
//   }
// }

const sleep = (time) => new Promise((acc) => setTimeout(acc, time))

export default sleep
