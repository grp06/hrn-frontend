import React from 'react'
import Chip from '@material-ui/core/Chip'

const OnboardingInterestTagInput = () => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.')
  }

  const handleClick = (event) => {
    console.log(event.target)
    console.log(event.target.parentNode.id)
    console.info('You clicked the Chip.')
  }
  return <Chip label="Maxs first chip" id={100} clickable onClick={handleClick} />
}

export default OnboardingInterestTagInput
