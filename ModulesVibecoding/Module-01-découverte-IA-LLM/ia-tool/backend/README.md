# Backend Preparation

This folder documents the future Ruby on Rails backend for Vibecoding IA Tool.
The commands are preparation notes for the training project. They are not
executed automatically, and this repository does not run `rails new` yet.

## What Rails Is

Ruby on Rails is a web application framework written in Ruby. It provides a
structured way to build applications with routing, controllers, models,
database migrations, validations, and API responses.

In this project, Rails will be used in API mode. That means the backend will
focus on receiving requests, storing data, and returning JSON responses for the
front-end interface.

## MVC Architecture

Rails follows the MVC pattern:

- Model: represents data and business rules. For this project, `TestDraft`
  would store the submitted source code, selected test framework, generated
  tests, explanations, and assumptions.
- View: presents data to the user. In an API-only Rails application, Rails does
  not generate traditional HTML views by default. The front-end handles the user
  interface.
- Controller: receives HTTP requests, calls the model layer, and returns a
  response. A `TestDraftsController` would handle actions such as creating or
  reading generated test drafts.

## Planned API Organization

The first backend resource is `TestDraft`, because the main product behavior is
to create a unit test draft from source code.

Expected REST endpoints:

- `GET /test_drafts`: list generated test drafts.
- `POST /test_drafts`: create a new test draft from submitted code.
- `GET /test_drafts/:id`: read one generated draft.
- `PATCH /test_drafts/:id`: update a draft after review.
- `DELETE /test_drafts/:id`: remove a draft.

The route example is documented in `routes.rb` with:

```ruby
resources :test_drafts
```

This Rails helper creates the standard REST routes for the `TestDraft` resource.

## Files In This Folder

```txt
backend/
  commands.md
  routes.rb
  README.md
```

- `commands.md`: Rails commands to create the future API application, generate
  the main resource, and run database migrations.
- `routes.rb`: example route configuration for the future Rails API.
- `README.md`: explanation of Rails, MVC, and the planned backend structure.
