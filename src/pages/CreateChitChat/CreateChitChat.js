import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { useLocation, Redirect } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { CreateChitChatForm } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getChitChatFormDetails } from '../../gql/queries'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({}))

const CreateChitChat = () => {
  const classes = useStyles()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const chitChatIdFromURL = searchParams.get('chitChatId')
  const [chitChatDetails, setChitChatDetails] = useState(null)
  const {
    user: { id: user_id, role },
  } = useUserContext()

  const [getChitChatFormDetailsQuery] = useLazyQuery(getChitChatFormDetails, {
    onCompleted: (data) => {
      const [chitChatDetails] = data.chit_chats
      setChitChatDetails(chitChatDetails)
    },
  })

  useEffect(() => {
    if (chitChatIdFromURL) {
      getChitChatFormDetailsQuery({ variables: { chit_chat_id: chitChatIdFromURL } })
    }
  }, [])

  // TODO redirect user to somewhere if they are not a celeb
  return chitChatIdFromURL && !chitChatDetails ? (
    <Loading />
  ) : (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ marginTop: '75px' }}
    >
      <CreateChitChatForm chitChatDetails={chitChatDetails} userId={user_id} />
    </Grid>
  )
}

export default CreateChitChat