import Button from 'react-bootstrap/Button'

function Phone({ phone }) {
  const phoneHref = phone.replace(/[^\d+]/g, '')

  return (
    <Button as="a" href={`tel:${phoneHref}`} variant="outline-success">
      Appeler
    </Button>
  )
}

export default Phone
