Rails.application.routes.draw do
  # Exposes the REST API endpoints for test drafts:
  # GET /test_drafts, POST /test_drafts, GET /test_drafts/:id,
  # PATCH/PUT /test_drafts/:id, and DELETE /test_drafts/:id.
  resources :test_drafts
end
