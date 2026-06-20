import { useState } from 'react'
import { faker } from '@faker-js/faker'
import Customer from './Customer'

const CUSTOMER_COUNT = 100

function buildEmail(firstName, lastName) {
  const cleanPart = (value) => (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
  )

  return `${cleanPart(lastName)}.${cleanPart(firstName)}@gmail.com`
}

function createCustomer() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const phone = faker.phone.number()

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    phone,
    email: buildEmail(firstName, lastName),
    avatar: faker.image.avatar(),
    jobTitle: faker.person.jobTitle(),
    address: `${faker.location.streetAddress()}, ${faker.location.zipCode()} ${faker.location.city()}`,
  }
}

function Customers() {
  const [customers] = useState(() =>
    Array.from({ length: CUSTOMER_COUNT }, createCustomer),
  )

  return (
    <section aria-labelledby="customers-title">
      <div className="customers-toolbar">
        <div>
          <h2 id="customers-title">Customers</h2>
          <p>{customers.length} generated profiles</p>
        </div>
      </div>

      <div className="customers-grid">
        {customers.map((customer) => (
          <Customer data={customer} key={customer.id} />
        ))}
      </div>
    </section>
  )
}

export default Customers
