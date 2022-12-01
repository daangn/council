import type { ComponentMeta } from '@storybook/react'

import SigninPage from './SigninPage'

export const generated = () => {
  return <SigninPage />
}

export default {
  title: 'Pages/SigninPage',
  component: SigninPage,
} as ComponentMeta<typeof SigninPage>
