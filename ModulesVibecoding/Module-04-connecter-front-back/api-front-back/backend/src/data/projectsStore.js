let nextProjectId = 3;

const projects = [
  {
    id: 1,
    title: "Create the backend API",
    description: "Expose a JSON endpoint that returns projects."
  },
  {
    id: 2,
    title: "Connect the frontend",
    description: "Fetch projects from the API and display them in the UI."
  }
];

export function getProjects() {
  return projects;
}

export function addProject({ title, description }) {
  const project = {
    id: nextProjectId,
    title,
    description
  };

  nextProjectId += 1;
  projects.push(project);

  return project;
}
