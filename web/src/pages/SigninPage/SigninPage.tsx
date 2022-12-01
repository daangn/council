import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SigninPage = () => {
  return (
    <>
      <MetaTags title="Signin" description="Signin page" />

      <h1>SigninPage</h1>
      <p>
        Find me in <code>./web/src/pages/SigninPage/SigninPage.tsx</code>
      </p>
      <p>
        My default route is named <code>signin</code>, link to me with `
        <Link to={routes.signin()}>Signin</Link>`
      </p>
    </>
  )
}

export default SigninPage
