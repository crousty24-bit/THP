import { useEffect, useState } from "react";
import { createProject, fetchProjects } from "../api/projectsApi.js";

const initialFormState = {
  title: "",
  description: ""
};

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectsFromApi = await fetchProjects();
        setProjects(projectsFromApi);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const createdProject = await createProject(formData);
      setProjects((currentProjects) => [...currentProjects, createdProject]);
      setFormData(initialFormState);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="projects-panel" aria-labelledby="projects-heading">
      <div className="panel-header">
        <div>
          <h1 id="projects-heading">Projects</h1>
        </div>
        <span className="project-count">{projects.length}</span>
      </div>

      <div className="content-grid">
        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="project-title">Title</label>
          <input
            id="project-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Build a small API"
            required
          />

          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this project should do."
            rows="4"
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create project"}
          </button>
        </form>

        <div className="projects-list" aria-live="polite">
          {isLoading ? <p className="status-message">Loading projects...</p> : null}
          {error ? <p className="error-message">{error}</p> : null}

          {!isLoading && projects.length === 0 ? (
            <p className="status-message">No projects yet.</p>
          ) : null}

          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
