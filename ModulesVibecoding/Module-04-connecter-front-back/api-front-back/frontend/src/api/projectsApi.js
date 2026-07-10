const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);

  if (!response.ok) {
    throw new Error("Unable to fetch projects.");
  }

  return response.json();
}

export async function createProject(project) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to create the project.");
  }

  return data;
}
