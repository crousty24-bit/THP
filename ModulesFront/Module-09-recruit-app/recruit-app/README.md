# Recruit App

React and Redux exercise for editing a small recruitment profile. The app
focuses on global state management, routing, form submission, derived state,
and local persistence.

## Features

- Two routes: home (`/`) and profile (`/profile`).
- Shared header with navigation, current user name, and skills count.
- Profile form for first name, last name, and comma-separated skills.
- Redux store split into user and skills reducers.
- Derived `fullName` and `skillsCount` values.
- `localStorage` persistence under `recruit-app-profile-state`.
- Responsive front-end with Sass styles.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm run dev
```

## Checks

```bash
pnpm run lint
pnpm run build
```

## Structure

```text
index.html
src/
  components/
    Header.jsx
    Logo.jsx
    UserName.jsx
  pages/
    Home.jsx
    Profile.jsx
  reducers/
    rootReducer.js
    skillsReducer.js
    userReducer.js
  store/
    store.js
  styles/
    main.scss
  App.jsx
  main.jsx
```

The Vite `base` option is set to `./` so the built app can be deployed under a
GitHub Pages subfolder.
