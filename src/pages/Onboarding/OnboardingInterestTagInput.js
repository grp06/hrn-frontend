import React, { useState } from 'react'
import Chip from '@material-ui/core/Chip'

const OnboardingInterestTagInput = ({ tagsData }) => {
  const [selectedTags, setSelectedTags] = useState([])
  console.log('tagsData', tagsData)
  console.log(selectedTags)
  const handleTagDelete = () => {
    console.info('You clicked the delete icon.')
  }

  const handleTagClick = (event) => {
    const elementClicked = event.target
    console.log('elementClicked', elementClicked)
    // check to see if we clicked label or actual chip
    if (elementClicked.className === 'MuiChip-label') {
      setSelectedTags((prevTags) => [...prevTags, elementClicked.parentElement.id])
      return elementClicked.parentElement.classList.add('MuiChip-colorPrimary')
    }
    setSelectedTags((prevTags) => [...prevTags, elementClicked.id])
    console.log(elementClicked.classList)
    return elementClicked.classList.add('MuiChip-colorPrimary')
  }

  const renderBusinessTags = () => {
    const listOfBusinessTags = tagsData.filter((tag) => tag.id >= 201 && tag.id <= 400)
    return listOfBusinessTags.map((businessTag) => {
      return (
        <Chip label={businessTag.name} id={businessTag.id} clickable onClick={handleTagClick} />
      )
    })
  }

  const renderSocialTags = () => {
    const listOfSocialTags = tagsData.filter((tag) => tag.id >= 1 && tag.id <= 200)
    return listOfSocialTags.map((socialTag) => {
      return <Chip label={socialTag.name} id={socialTag.id} clickable onClick={handleTagClick} />
    })
  }

  return (
    <div>
      {renderBusinessTags()}
      {renderSocialTags()}
    </div>
  )
}

export default OnboardingInterestTagInput
