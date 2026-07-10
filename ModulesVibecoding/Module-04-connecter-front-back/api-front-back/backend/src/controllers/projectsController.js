import { addProject, getProjects } from "../data/projectsStore.js";

export function index(_request, response) {
  response.json(getProjects());
}

export function create(request, response) {
  const title = request.body?.title?.trim();
  const description = request.body?.description?.trim();

  if (!title || !description) {
    return response.status(422).json({
      error: "Title and description are required."
    });
  }

  const project = addProject({ title, description });

  return response.status(201).json(project);
}
