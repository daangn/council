let someError = result => {
  switch result {
  | Ok(_) => None
  | Error(e) => Some(e)
  }
}
