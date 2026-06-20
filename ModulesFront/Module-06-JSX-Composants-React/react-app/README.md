# Merchant Contact

React exercise for displaying one hundred generated customer profiles with
Faker.js, Bootstrap, and reusable components.

## Features

- Generates 100 fake customers on app load.
- Shows a preview card with first name, last name, photo, and three actions.
- Provides `mailto:` and `tel:` links for each customer.
- Toggles inline details for job title, email, phone, and address.
- Uses Bootstrap and React-Bootstrap for the card and button UI.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm run dev
```

## Build

```bash
pnpm run build
```

The Vite `base` option is set to `./` so the built app can be deployed under a
GitHub Pages subfolder.

## Structure

```text
src/
  components/
    Customer.jsx
    Customers.jsx
    Email.jsx
    Phone.jsx
  App.jsx
  App.css
  index.css
  main.jsx
```
