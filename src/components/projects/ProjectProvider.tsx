import {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {Project, projectService} from "../../services/ProjectService";
import {ApiError} from "../../services/ApiError";
import useAuth from "../../hooks/auth/useAuth";

type CreateProjectFn = (name: string, description: string) => Promise<Project>;
type RenameProjectFn = (projectId: number, name: string) => Promise<Project>;
type DeleteProjectFn = (projectId: number) => Promise<void>;

interface ProjectProviderState {
  projects?: Project[];
  loading: boolean;
  loadingError: ApiError | null;
  createProject?: CreateProjectFn;
  renameProject?: RenameProjectFn;
  deleteProject?: DeleteProjectFn;
  operating: boolean;
  saveError: ApiError | null;
  renameError: ApiError | null;
  deleteError: ApiError | null;
}

const initialState: ProjectProviderState = {
  loading: false,
  loadingError: null,
  operating: false,
  saveError: null,
  renameError: null,
  deleteError: null,
};

export const ProjectContext = createContext<ProjectProviderState>(initialState);

interface ProjectProviderProps {
  children: ReactNode;
}

export default function ProjectProvider({children}: ProjectProviderProps) {
  const [projectsState, setProjectsState] = useState<ProjectProviderState>(initialState);
  const {token} = useAuth();

  useEffect(loadProjectsEffect, [token]);

  const createProject: CreateProjectFn = useCallback(async (name, description) => {
    setProjectsState({
      ...projectsState,
      operating: true,
      saveError: null,
    });

    try {
      const project = await projectService.createProject(name, description, token);

      setProjectsState({
        ...projectsState,
        projects: [...(projectsState.projects ?? []), project],
        operating: false,
        saveError: null,
      });

      return project;
    } catch (error) {
      setProjectsState({
        ...projectsState,
        operating: false,
        saveError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [projectsState, projectService, token]);

  const renameProject: RenameProjectFn = useCallback(async (projectId, name) => {
    setProjectsState({
      ...projectsState,
      operating: true,
      renameError: null,
    });

    try {
      const project = await projectService.renameProject(projectId, name, token);

      setProjectsState({
        ...projectsState,
        projects: (projectsState.projects ?? []).map(p => p.id === projectId ? project : p),
        operating: false,
        renameError: null,
      });

      return project;
    } catch (error) {
      setProjectsState({
        ...projectsState,
        operating: false,
        renameError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [projectsState, projectService, token]);

  const deleteProject: DeleteProjectFn = useCallback(async (projectId) => {
    setProjectsState({
      ...projectsState,
      operating: true,
      deleteError: null,
    });

    try {
      await projectService.deleteProject(projectId, token);

      setProjectsState({
        ...projectsState,
        projects: (projectsState.projects ?? []).filter(p => p.id !== projectId),
        operating: false,
        deleteError: null,
      });
    } catch (error) {
      setProjectsState({
        ...projectsState,
        operating: false,
        deleteError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [projectsState, projectService, token]);

  const {projects, loading, loadingError, operating, saveError, renameError, deleteError} = projectsState;
  const value = {
    projects, loading, loadingError,
    createProject, renameProject, deleteProject, operating, saveError, renameError, deleteError
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );

  function loadProjectsEffect() {
    let canceled = false;

    if (token.trim() != '') {
      loadProjects();
    }

    return () => {
      canceled = true;
    };

    async function loadProjects() {
      setProjectsState({
        ...projectsState,
        loading: true,
        loadingError: null,
      });

      try {
        const projects = await projectService.getAll(token);

        if (canceled) return;

        setProjectsState({
          ...projectsState,
          projects,
          loading: false,
          loadingError: null,
        });
      } catch (error) {
        if (canceled) return;

        setProjectsState({
          ...projectsState,
          loading: false,
          loadingError: error as ApiError,
        });
      }
    }
  }
}