import React from 'react'
import { useQuery } from 'react-apollo'
import { makeStyles } from '@material-ui/styles'
import { getAllMyConnections } from '../../gql/queries'
import { useAppContext } from '../../context/useAppContext'
import { ConnectionCard } from '.'
import { Loading } from '../../common'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '150px',
  },
}))

const MyConnections = () => {
  const classes = useStyles()
  const { app, user } = useAppContext()
  const { userId } = user
  const { appLoading } = app
  const { data: allMyConnectionsData, loading: allMyConnectionsDataLoading } = useQuery(
    getAllMyConnections,
    {
      variables: {
        user_id: userId,
      },
    }
  )

  if (appLoading || allMyConnectionsDataLoading) {
    return <Loading />
  }

  // TODO: make this its own util function
  // It looks hairy below  because we need to filter between partnerX and partnerY to
  // remove your info, and then make sure we are not returning duplicate connections
  // Ideally this is its own util function that doesnt use the useMutation hook
  // so we dont need to import React
  const arrayOfUniqueConnectionsIds = []

  const arrayOfMyAllMyUniqueConnections = allMyConnectionsData.rounds
    .map((round) => {
      return Object.values(round).filter((person) => person.id !== userId)
    })
    .map((personArray) => {
      const personsId = personArray[0].id
      if (arrayOfUniqueConnectionsIds.indexOf(personsId) === -1) {
        arrayOfUniqueConnectionsIds.push(personsId)
        return personArray[0]
      }
      return null
    })
    .filter((el) => el !== null)

  const renderConnectionCards = () => {
    return arrayOfMyAllMyUniqueConnections.map((connection) => {
      return <ConnectionCard key={connection.id} connection={connection} />
    })
  }

  console.log('renderConnectionCards ->', renderConnectionCards)
  console.log('allMyConnectionsData ->', allMyConnectionsData)
  console.log('arrayOfMyAllMyUniqueConnections ->', arrayOfMyAllMyUniqueConnections)

  return <div className={classes.pageContainer}>{renderConnectionCards()}</div>
}

export default MyConnections
