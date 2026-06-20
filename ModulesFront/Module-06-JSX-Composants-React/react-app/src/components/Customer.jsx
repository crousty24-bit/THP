import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import ListGroup from 'react-bootstrap/ListGroup'
import Email from './Email'
import Phone from './Phone'

function Customer({ data }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const fullName = `${data.firstName} ${data.lastName}`
  const detailsId = `customer-details-${data.id}`

  return (
    <Card className="customer-card h-100">
      <Card.Img
        className="customer-avatar"
        variant="top"
        src={data.avatar}
        alt={`Portrait of ${fullName}`}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{fullName}</Card.Title>

        <div className="customer-actions">
          <Email email={data.email} />
          <Phone phone={data.phone} />
          <Button
            aria-controls={detailsId}
            aria-expanded={isDetailsOpen}
            onClick={() => setIsDetailsOpen((current) => !current)}
            type="button"
            variant={isDetailsOpen ? 'outline-secondary' : 'primary'}
          >
            {isDetailsOpen ? 'Masquer les détails' : 'Afficher les détails'}
          </Button>
        </div>

        <Collapse in={isDetailsOpen}>
          <div id={detailsId}>
            <ListGroup className="customer-details" variant="flush">
              <ListGroup.Item>
                <span>Métier</span>
                <strong>{data.jobTitle}</strong>
              </ListGroup.Item>
              <ListGroup.Item>
                <span>Email</span>
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </ListGroup.Item>
              <ListGroup.Item>
                <span>Téléphone</span>
                <a href={`tel:${data.phone.replace(/[^\d+]/g, '')}`}>
                  {data.phone}
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <span>Adresse</span>
                <strong>{data.address}</strong>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Customer
