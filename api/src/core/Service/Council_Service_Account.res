@genType
type error =
  | IOError
  | InvalidSignup({name: bool, email: bool})

@genType
let validateSignup = (~name, ~email) => {
  let validateName = name => {
    Js.String2.length(name) >= 2
  }

  let validateEmail = email => {
    let re = %re(
      "/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/"
    )
    re->Js.Re.test_(email)
  }

  switch (validateName(name), validateEmail(email)) {
  | (true, true) => Ok()
  | (name, email) => Error(InvalidSignup({name, email}))
  }
}
