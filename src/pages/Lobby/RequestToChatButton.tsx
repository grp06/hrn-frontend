import React, { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Button, CircularProgress } from '@material-ui/core'
import { upsertPartnersRequestToChat } from '../../gql/mutations'
import { getPartnersRowByPartnerAndUserId } from '../../gql/queries'
import { EventObjectInterface, PartnersObjectInterface } from '../../utils'

export interface ChatToRequestButtonProps {
  myPartnerRow: PartnersObjectInterface | undefined
  event: EventObjectInterface
  partnerId: number
  userId: number
}

const RequestToChatButton: React.FC<ChatToRequestButtonProps> = ({
  myPartnerRow,
  event,
  partnerId,
  userId,
}) => {
  const { current_round, id: event_id } = event
  const [chatRequestInFlight, setChatRequestInFlight] = useState<boolean>(false)
  const [upsertPartnersRequestToChatMutation] = useMutation(upsertPartnersRequestToChat)
  const [getPartnersRowId, { data: myPartnersPartnerRowData }] = useLazyQuery(
    getPartnersRowByPartnerAndUserId,
    {
      variables: {
        event_id,
        partner_id: userId,
        round: 1,
        user_id: partnerId,
      },
      onCompleted: async (data) => {
        console.log('🌈 ~ partnerId', partnerId)
        console.log('🌈 ~ userId', userId)
        try {
          await upsertPartnersRequestToChatMutation({
            variables: {
              partner_row: [
                {
                  id: myPartnerRow?.id,
                  event_id,
                  partner_id: partnerId,
                  round: 1,
                  user_id: userId,
                  chat_request: 'cancelled',
                },
                { ...data.partners[0], chat_request: 'cancelled' },
              ],
            },
          })
        } catch (err) {
          alert(err)
          console.log(err)
        }
      },
    }
  )

  const handleCancelRequest = async () => {
    //lazy query to get myPartnersPartner row (since I dont have the ID of my partners row)
    try {
      setChatRequestInFlight(true)
      await getPartnersRowId()
      setChatRequestInFlight(false)
    } catch (err) {
      alert(err)
      console.log(err)
    }
  }

  const handleRequestToChat = async () => {
    try {
      setChatRequestInFlight(true)
      // insert a row for yourself and then a row for your partner so
      // they can get the notification from the subscription in the Lobby
      await upsertPartnersRequestToChatMutation({
        variables: {
          partner_row: [
            {
              chat_request: 'request-sent',
              event_id,
              partner_id: partnerId,
              round: 1,
              user_id: userId,
            },
            {
              chat_request: 'pending',
              event_id,
              partner_id: userId,
              round: 1,
              user_id: partnerId,
            },
          ],
        },
      })
      setChatRequestInFlight(false)
    } catch (err) {
      alert(err)
      console.log(err)
    }
  }

  const renderButtonBasedOnRequestStatus = () => {
    if (!myPartnerRow) {
      return (
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={chatRequestInFlight}
          disableRipple
          style={{ minWidth: 0 }}
          onClick={() => handleRequestToChat()}
        >
          Request to chat
        </Button>
      )
    }
    switch (myPartnerRow.chat_request) {
      case 'request-sent':
        return (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            disabled={chatRequestInFlight}
            disableRipple
            style={{ minWidth: 0 }}
            onClick={() => handleCancelRequest()}
            startIcon={<CircularProgress color="primary" size={14} />}
          >
            Cancel Request
          </Button>
        )
      case 'denied':
      case 'cancelled':
        return (
          <Button
            variant="contained"
            size="small"
            color="primary"
            disableRipple
            disabled
            style={{ minWidth: 0 }}
          >
            Request to chat
          </Button>
        )
      default:
        return null
    }
  }

  return <>{renderButtonBasedOnRequestStatus()}</>
}

export default RequestToChatButton
