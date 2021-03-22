import React, { useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { MysteryQuestionBox, useVideoRoomStyles } from '.'

export interface IcebreakerQuestionCardProps {
  // icebreakerQuestionsArray: { category: string; question: string }[]
  // removeIcebreakerQuestionFromContext: Function
}

const IcebreakerQuestionCard: React.FC<IcebreakerQuestionCardProps> = (
  {
    // icebreakerQuestionsArray, removeIcebreakerQuestionFromContext
  }
) => {
  const classes = useVideoRoomStyles()
  const [questionToDisplay, setQuestionToDisplay] = useState<{
    category: string
    question: string
  }>({ category: '', question: '' })
  const icebreakerQuestionsArray = [
    { category: 'Profound 🙇‍♀️', question: 'What makes your heart glow?' },
    { category: 'Profound 🙇‍♀️', question: 'What memory instantly makes you smile?' },
    { category: 'Profound 🙇‍♀️', question: 'What would you like to attract more of in your life?' },
    {
      category: 'Workplace 💼',
      question: 'Who is your favorite person to work with in the company?',
    },
    { category: 'Workplace 💼', question: 'What do you most like about your job and why? ' },
  ]

  const onBoxClick = () => {
    const randomNumber = Math.floor(Math.random() * icebreakerQuestionsArray.length)
    console.log(icebreakerQuestionsArray[randomNumber])
    // removeIcebreakerQuestionFromContext(randomNumber)
    setQuestionToDisplay(icebreakerQuestionsArray[randomNumber])
  }

  return (
    <Grid
      container
      direction="row"
      className={classes.icebreakerQuestionCard}
      alignItems="center"
      justify="space-around"
    >
      <MysteryQuestionBox onBoxClick={onBoxClick} />
      {questionToDisplay.category && questionToDisplay.question ? (
        <Grid container direction="column" justify="center" className={classes.questionContainer}>
          <Typography variant="subtitle1">{questionToDisplay.category}</Typography>
          <div className={classes.questionDividerLine} />
          <Typography variant="body1"> {questionToDisplay.question}</Typography>
        </Grid>
      ) : null}
    </Grid>
  )
}

export default IcebreakerQuestionCard
