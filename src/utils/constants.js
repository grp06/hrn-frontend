import relevantMatching from '../assets/relevantMatchingIcon.svg'
import twoSidedMatching from '../assets/twoSidedMatchingIcon.svg'

const constants = {
  // change me back to 20000?
  // george, stephen, max, jasper, yamila
  adminUserIds: [8, 12, 5218, 6069],
  // uncle t, brenden, seibo, ash, parker, karl, nino, julia kim, marcus (village voices), kata
  hrnFriendsUserIds: [254, 1933, 2926, 3974, 4888, 5895, 6246, 6321, 6390, 6674],
  lastSeenDuration: 5000,
  roundLength: 300,
  betweenRoundsDelay: 20000,
  partnerCameraIssueTimeout: 25000,
  hasPartnerAndIsConnectingBreathingRoom: 1500,
  maxNumUsersPerRoom: 40,
  drawerWidth: 175,
  bottomNavBarHeight: 80,
  crispWebsiteId: '1b6b1463-9594-48be-a161-db20a94bbe2b',
  giveFeedbackTypeform: 'https://stephen687387.typeform.com/to/pMRsCo',
  firefoxCameraPermissionHowTo:
    'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions#w_using-the-firefox-2optionssf3preferencessf-menu-to-change-camera-and-microphone-permissions',
  chromeCameraPermissionHowTo:
    'https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop&hl=en',
  safariCameraPermissionHowTo:
    'https://support.apple.com/guide/safari/customize-settings-per-website-ibrw7f78f7fe/13.0/mac/10.15',
  bannedUserIds: [3477, 2329],
  USER_ID: 'userId',
  TOKEN: 'token',
  ROLE: 'role',
  PLAN_TYPE: 'plan_type',
  postChatRatingSnackMessagesArray: [
    'Carrier pigeon sent 🕊',
    "We've put in a good word 🤗",
    'Snail mail delivered 🐌',
    'Sent via pony express 🐴',
    "Hedwig's on her way 🦉",
  ],
  connectingYouToSomeoneMessagesArray: [
    ['Connecting you to someone awesome!', 'Give us a few seconds to roll out your red carpet 💃.'],
    ['We think this next person is a gem!', 'Hang tight, connecting you two in a bit 💎.'],
    [
      'Got someone awesome on the other line for you!',
      'Please hold for a few seconds while we connect all the wires 👷‍♀️.',
    ],
    ["Don't go anywhere!", "There's someone here that just can't wait to get to know you 🥺."],
    [
      "We're excited for you to meet this next person!",
      'Just a few seconds more while we show them to the room 🦮.',
    ],
  ],
  matchingOptionCardObjects: [
    {
      name: 'Relevant',
      description: 'Attendees will be matched based on common interests.',
      databaseValue: 'relevant',
      imageURL: relevantMatching,
      allowedRoles: ['free', 'premium'],
    },
    {
      name: 'Two-Sided',
      description:
        'Split the attendees into 2 subgroups. Members of one subgroup will only match with the other, whenever possible.',
      databaseValue: 'two-sided',
      imageURL: twoSidedMatching,
      allowedRoles: ['premium'],
    },
  ],
}

export default constants
