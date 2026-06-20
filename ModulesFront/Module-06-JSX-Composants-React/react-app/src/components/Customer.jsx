import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Email from './Email'
import Phone from './Phone'

function Customer({ data }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const fullName = `${data.firstName} ${data.lastName}`

  return (
    <>
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
              onClick={() => setIsDetailsOpen(true)}
              type="button"
              variant="primary"
            >
              Afficher les détails
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal
        backdropClassName="customer-modal-backdrop"
        centered
        dialogClassName="customer-modal"
        onHide={() => setIsDetailsOpen(false)}
        show={isDetailsOpen}
      >
        <Modal.Header closeButton>
          <Modal.Title>{fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setIsDetailsOpen(false)}
            type="button"
            variant="secondary"
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Customer
