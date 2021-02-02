import React, { useState } from 'react'
import { SignUpLanding } from '.'
import { CelebSignUpForm } from '../Auth'

export const CelebSignUp = () => {
  const [showSignUpForm, setShowSignUpForm] = useState(false)

  return showSignUpForm ? (
    <CelebSignUpForm />
  ) : (
    <SignUpLanding setShowSignUpForm={setShowSignUpForm} />
  )
}
