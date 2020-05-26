const grabExistingData = (userIds, prevAssignments) => {
  // const map = JSON.parse(allAssignments)
  const map = prevAssignments
  userIds.forEach((id) => {
    if (!map[id]) {
      map[id] = []
    }
  })
  return map
}

const initialUserIdsMap = (userIds) => {
  return userIds.reduce((all, item, index) => {
    all[item] = []
    return all
  }, {})
}

//main class, just to store stuff
function GeorgeAlgo(userIds, prevAssignments) {
  const firstRun = !prevAssignments ? true : false

  const userIdsMap = firstRun
    ? initialUserIdsMap(userIds)
    : grabExistingData(userIds, prevAssignments)

  console.log('userIdMap = ', userIdsMap)
  const copyOfUserIds = userIds.slice()
  var half_length = Math.ceil(userIds.length / 2)
  var t1 = userIds.splice(0, half_length)
  var t2 = userIds.slice(0, half_length)
  console.log('about to add to the map = ', userIdsMap)

  // imagine people sitting around a table, and rotating
  // person 1 NEVER moves
  // Round 1
  // 1 | 4
  // 2 | 5
  // 3 | 6
  // Round 2
  // 1 | 2
  // 3 | 4
  // 6 | 5
  // if there's an odd number, we need to add a blank user
  // or null to the table. That blank user will rotate around too
  // Round 1
  // 1 | 4
  // 2 | 5
  // 3 | 6
  // 4 | x
  // Round 2
  // 1 | 2
  // 3 | 4
  // 4 | 5
  // x | 6
  const rotatePlayers = () => {
    t2.unshift(t1[1])
    t1.splice(1, 1)
    t1.push(t2[t2.length - 1])
    t2.pop()
  }

  let numAssignmentsMade = 0
  const allAssignmentsMade = Object.values(userIdsMap)[0].length === copyOfUserIds.length - 1
  const pairingsArray = []
  const makeAssignments = () => {
    rotatePlayers()
    numAssignmentsMade = 0
    for (let i = 0; i < t1.length; i++) {
      const player1 = t1[i]
      const player2 = t2[i]
      const player1Partners = userIdsMap[player1]
      const player2Partners = userIdsMap[player2]
      if (player1Partners.indexOf(player2) === -1 && player2Partners.indexOf(player1) === -1) {
        player1Partners.push(player2)
        player2Partners.push(player1)
        pairingsArray.push([player1, player2])
        numAssignmentsMade++
      }
    }
    console.log('pairingsArray', pairingsArray)
    //if everyone hasn't been assigned
    //rotate people around again, try again
    if (numAssignmentsMade < t2.length && !allAssignmentsMade) {
      makeAssignments()
    }
  }
  if (!allAssignmentsMade) {
    makeAssignments()
  }
  return { pairingsArray }
}

export default GeorgeAlgo

// Main.prototype.pairOffuserIds = function () {
//   const { userIds } = this
//   //if this is the first time we're making assigments,
//   //lets build a map of all users {1: [], 2: [], 3: []} etc...
//   //otherwise, load in object from GraphQL
//   //I'm pretty you'll load the 'rounds' table in from graphQL then
//   //need to turn that into the shape of this map
//   const useExistingData = () => {
//     const map = JSON.parse(allAssignments)
//     userIds.forEach((id) => {
//       if (!map[id]) {
//         map[id] = []
//       }
//     })
//     return map
//   }
//   const userIdsMap = firstRun ? this.userIdsMap() : useExistingData()

//   return fs.writeFileSync('all-assignments.json', JSON.stringify(userIdsMap))
// }
// Main.prototype.init = function () {
//   this.pairOffuserIds()
// }
// //load all userId's
// const userIds = ['1', '2', '3', '4', '5', '6', '7', 'null']
// execMain = new Main(userIds)
// console.log(execMain.init())
