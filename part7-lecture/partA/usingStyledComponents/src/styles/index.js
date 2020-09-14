import styled from 'styled-components'

// The code above creates styled versions of the button and input HTML elements and then assigns them to the Button and Input variables.
const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
  background: Bisque;
`
const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`
const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`
const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

export default { Button, Input, Page, Navigation, Footer }
