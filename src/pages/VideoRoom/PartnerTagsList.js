import React from 'react'
import { Chip, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  tagsContainer: {
    margin: theme.spacing(1.5, 'auto', 0, 'auto'),
    padding: theme.spacing(0, 1),
  },
}))

const PartnerTagsList = ({ myRound, myTagsArray }) => {
  const classes = useStyles()
  const remoteVideoDiv = document.getElementById('remote-video')
  const partnerVideoDivExists = remoteVideoDiv && remoteVideoDiv.innerHTML
  const myPartnersTagsArray = myRound.partner ? myRound.partner.tags_users : []
  const myTagsArrayOnlyIds =
    myTagsArray && myTagsArray.length ? myTagsArray.map((tagObject) => tagObject.tag.tag_id) : []

  const overlappingTagsOnlyIds =
    myTagsArrayOnlyIds.length && myPartnersTagsArray.length
      ? myPartnersTagsArray.reduce((all, partnersTabObject) => {
          if (myTagsArrayOnlyIds.includes(partnersTabObject.tag.tag_id))
            all.push(partnersTabObject.tag.tag_id)
          return all
        }, [])
      : []

  return partnerVideoDivExists && myPartnersTagsArray.length ? (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      wrap="wrap"
      className={classes.tagsContainer}
    >
      {myRound.partner.tags_users
        .sort((tagA, tagB) => {
          return tagA.tag.name.length < tagB.tag.name.length
        })
        .map((tagObject) => {
          const { tag } = tagObject
          const isThisAnOverlappingTag = overlappingTagsOnlyIds.length
            ? overlappingTagsOnlyIds.includes(tag.tag_id)
            : false
          return (
            <Chip
              key={tag.tag_id}
              label={tag.name}
              id={tag.tag_id}
              style={{
                backgroundColor: isThisAnOverlappingTag ? '#8C57DB' : '#191919',
                color: '#f4f6fa',
              }}
            />
          )
        })}
    </Grid>
  ) : null
}
export default PartnerTagsList
