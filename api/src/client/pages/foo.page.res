type pageProps = {
  foo: string,
}

let getPageProps = () => {
  foo: "bar"
}

@react.component(: pageProps)
let default = (~foo) => {
  <div> {React.string(foo)} </div>
}
