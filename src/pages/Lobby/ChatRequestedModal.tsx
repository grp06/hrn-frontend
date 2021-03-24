import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Avatar, Backdrop, Button, Fade, Grid, Modal, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { upsertPartnersRequestToChat } from '../../gql/mutations'
import { getPartnersRowByPartnerAndUserId } from '../../gql/queries'
import { PartnersObjectInterface } from '../../utils'

export interface ChatRequestedModalProps {
  chatRequest: PartnersObjectInterface
}

const ChatRequestedModal: React.FC<ChatRequestedModalProps> = ({ chatRequest }) => {
  const classes = useLobbyStyles()
  const { event_id, id: myPartnerRowId, partner, partner_id, round, user_id } = chatRequest
  const { city: partnersCity, name: partnersName, profile_pic_url: partnersPicURL } = partner
  const [open, setOpen] = useState<boolean>(true)
  const [requestResponse, setRequestResponse] = useState<string>('')
  const [requestResponseInFlight, setRequestResponseInFlight] = useState<boolean>(false)

  const [upsertPartnersRequestToChatMutation] = useMutation(upsertPartnersRequestToChat)
  const [getPartnersRowId] = useLazyQuery(getPartnersRowByPartnerAndUserId, {
    variables: {
      event_id,
      partner_id: user_id,
      round: 1,
      user_id: partner_id,
    },
    onCompleted: async (data) => {
      try {
        await upsertPartnersRequestToChatMutation({
          variables: {
            partner_row: [
              {
                id: myPartnerRowId,
                event_id,
                partner_id,
                round: 1,
                user_id,
                chat_request: requestResponse,
              },
              { ...data.partners[0], chat_request: requestResponse },
            ],
          },
        })
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
  })

  useEffect(() => {
    const sendResponse = async () => {
      try {
        await getPartnersRowId()
        closeModal()
      } catch (err) {
        alert(err)
        console.log(err)
      }
    }

    if (requestResponse) {
      sendResponse()
    }
  }, [requestResponse])

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modalContainer}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.modalPaper}
        >
          <Grid container justify="center" className={classes.modalBody}>
            <Typography variant="h3">
              Someone wants to chat with you{' '}
              <span role="img" aria-label="man dancing">
                🕺
              </span>
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              style={{ marginTop: '16px' }}
            >
              <Avatar className={classes.chatRequestedPartnerAvatarContainer}>
                <img
                  alt="partners-photo"
                  src={partnersPicURL || logo}
                  className={classes.chatRequestedPartnerAvatar}
                />
              </Avatar>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                justify="flex-start"
                style={{ width: 'auto', marginLeft: '12px' }}
              >
                <Typography variant="h4">{partnersName}</Typography>
                <Typography variant="body1">{partnersCity}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction="row"
            justify="space-around"
            alignItems="center"
            wrap="wrap"
            className={classes.modalButtonContainer}
          >
            <Button
              variant="contained"
              disabled={requestResponseInFlight}
              size="large"
              color="primary"
              className={classes.modalAcceptButton}
              onClick={() => {
                setRequestResponseInFlight(true)
                setRequestResponse('accepted')
              }}
            >
              Sure, Let&apos;s chat
            </Button>
            <Button
              variant="contained"
              size="large"
              className={classes.modalCancelButton}
              onClick={() => {
                setRequestResponseInFlight(true)
                setRequestResponse('denied')
              }}
            >
              No thanks
            </Button>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  )
}

export default ChatRequestedModal
