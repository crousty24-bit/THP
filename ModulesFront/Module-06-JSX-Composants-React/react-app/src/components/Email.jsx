import Button from 'react-bootstrap/Button'

function Email({ email }) {
  return (
    <Button as="a" href={`mailto:${email}`} variant="outline-primary">
      Envoyer un Mail
    </Button>
  )
}

export default Email
