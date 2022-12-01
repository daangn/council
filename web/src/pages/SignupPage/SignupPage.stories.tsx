import type { ComponentMeta } from '@storybook/react'

import SignupPage from './SignupPage'

export const generated = () => {
  return <SignupPage />
}

export default {
  title: 'Pages/SignupPage',
  component: SignupPage,
} as ComponentMeta<typeof SignupPage>
