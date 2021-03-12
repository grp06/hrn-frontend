export interface UserObjectInterface {
  id: number
  name: string
  role: string
  email: string
  city: string
  short_bio: string | null
  linkedIn_url: string | null
  profile_pic_url: string | null
  stripe_customer_id: string | null
  sub_period_end: string | null
  tags_users: object[]
}

export interface EventObjectInterface {
  banner_photo_url: string | null
  current_round: number
  description: string
  ended_at: string | null
  event_name: string
  event_users: { user: UserObjectInterface; side: string }[]
  group_video_chat: boolean
  host: UserObjectInterface
  host_id: number
  id: number
  matching_type: string
  num_rounds: number
  public_event: boolean
  round_length: number
  side_a: string | null
  side_b: string | null
  start_at: string
  status: string
  updated_at: string
}

export interface TransitionModalInterface {
  button?: {
    buttonColor?: string
    buttonSize?: string
    buttonStyle?: object
    buttonText?: string | JSX.Element
    buttonVariant?: string
  }
  disabled?: boolean
  hideNoWay?: boolean
  iconButton?: {
    iconButtonColor?: string
    iconButtonIcon?: JSX.Element
    iconButtonSize?: string
  }
  modalBody: JSX.Element
  onAcceptButtonText?: string
  onAcceptFunction: Function
  onCloseButtonText?: string
  onCloseFunction?: Function
}

export interface OnlineEventUsersInterface {
  user: { [user: string]: UserObjectInterface }[]
  side: string | null
}
