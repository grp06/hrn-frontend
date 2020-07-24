import React, { useEffect } from 'react'
import Geosuggest from 'react-geosuggest'
import { makeStyles } from '@material-ui/styles'
import './geosuggest.css'

const useStyles = makeStyles((theme) => ({
  geosuggestContainer: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  geosuggestLabel: {
    color: theme.palette.common.orchid,
    fontWeight: '300',
  },
  geosuggestInput: {
    width: '100%',
    padding: theme.spacing(0.5, 0),
    fontSize: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid #3e4042',
    fontWeight: '300',
    color: theme.palette.common.ghostWhiteBody,
    fontFamily: 'Muli',
    marginTop: theme.spacing(3),
  },
  geosuggestSuggests: {
    marginTop: 0,
    backgroundColor: theme.palette.common.greyHighlight,
    borderRadius: '4px',
  },
  geosuggestItem: {
    width: '100%',
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
    padding: theme.spacing(1, 0),
    borderBottom: '1px solid #3e4042',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.common.greyBorder,
    },
  },
}))

const GeosuggestCityInput = ({ placeholder, initialValue, onSuggestSelectCallback }) => {
  const classes = useStyles()

  useEffect(() => {
    const geosuggestLabelDOMElement = document.getElementById('geosuggest-label')
    const geosuggestUnderlineDOMElement = document.getElementById('geosuggest-form-container')
    geosuggestLabelDOMElement.classList.add(
      'MuiFormLabel-root',
      'MuiInputLabel-root',
      'MuiInputLabel-formControl',
      'MuiInputLabel-animated',
      'MuiInputLabel-shrink',
      'MuiFormLabel-filled'
    )
    geosuggestUnderlineDOMElement.classList.add(
      // 'MuiInputBase-root',
      'MuiInput-root',
      // 'MuiInput-underline',
      'MuiInputBase-fullWidth',
      'MuiInput-fullWidth',
      'MuiInputBase-formControl',
      'MuiInput-formControl'
    )
    // console.log(geosuggestDOMElement)
  }, [])

  return (
    <div id="geosuggest-form-container" className={classes.geosuggestContainer}>
      <div id="geosuggest-label" className={classes.geosuggestLabel}>
        city
      </div>
      <Geosuggest
        placeholder={placeholder}
        types={['(cities)']}
        initialValue={initialValue}
        ignoreTab
        inputClassName={classes.geosuggestInput}
        suggestsClassName={classes.geosuggestSuggests}
        suggestItemClassName={classes.geosuggestItem}
        onSuggestSelect={onSuggestSelectCallback}
      />
    </div>
  )
}

export default GeosuggestCityInput
