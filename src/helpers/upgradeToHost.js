const upgradeToHost = async (userId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signup/upgrade-to-host`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ userId }),
  }).then((res) => res.json())
}

export default upgradeToHost
