import {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import useAuth from "../../hooks/auth/useAuth";
import {ProjectMember, projectService} from "../../services/ProjectService";
import {ApiError} from "../../services/ApiError";

type AddProjectMemberFn = (username: string, role: string) => Promise<ProjectMember>;
type RemoveProjectMemberFn = (userId: number) => Promise<void>;

interface ProjectMemberProviderState {
  members?: ProjectMember[];
  loading: boolean;
  loadingError: ApiError | null;
  addMember?: AddProjectMemberFn;
  removeMember?: RemoveProjectMemberFn;
  operating: boolean;
  saveError: ApiError | null;
  deleteError: ApiError | null;
}

const initialState: ProjectMemberProviderState = {
  loading: false,
  loadingError: null,
  operating: false,
  saveError: null,
  deleteError: null,
};

export const ProjectMemberContext = createContext<ProjectMemberProviderState>(initialState);

interface ProjectMemberProviderProps {
  projectId: number;
  children: ReactNode;
}

export default function ProjectMemberProvider({projectId, children}: ProjectMemberProviderProps) {
  const [projectMembersState, setProjectMembersState] = useState<ProjectMemberProviderState>(initialState);
  const {token} = useAuth();

  useEffect(loadProjectMembersEffect, [projectId, token]);

  const addMember: AddProjectMemberFn = useCallback(async (username, role) => {
    setProjectMembersState({
      ...projectMembersState,
      operating: true,
      saveError: null,
    });

    try {
      const member = await projectService.addMemberToProject(projectId, username, role, token);

      setProjectMembersState({
        ...projectMembersState,
        members: [...(projectMembersState.members ?? []), member],
        operating: false,
        saveError: null,
      });

      return member;
    } catch (error) {
      setProjectMembersState({
        ...projectMembersState,
        operating: false,
        saveError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [projectMembersState, projectService, token, projectId]);

  const removeMember: RemoveProjectMemberFn = useCallback(async (userId) => {
    setProjectMembersState({
      ...projectMembersState,
      operating: true,
      deleteError: null,
    });

    try {
      await projectService.removeMemberFromProject(projectId, userId, token);

      setProjectMembersState({
        ...projectMembersState,
        members: (projectMembersState.members ?? []).filter(m => m.userId !== userId),
        operating: false,
        deleteError: null,
      });
    } catch (error) {
      setProjectMembersState({
        ...projectMembersState,
        operating: false,
        deleteError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [projectMembersState, projectService, token, projectId]);

  const {members, loading, loadingError, operating, saveError, deleteError} = projectMembersState;
  const value = {
    members, loading, loadingError,
    addMember, removeMember, operating, saveError, deleteError
  };
  return (
    <ProjectMemberContext.Provider value={value}>
      {children}
    </ProjectMemberContext.Provider>
  );

  function loadProjectMembersEffect() {
    let canceled = false;

    if (token.trim() !== '') {
      loadProjectMembers();
    }

    return () => {
      canceled = true;
    };

    async function loadProjectMembers() {
      setProjectMembersState({
        ...projectMembersState,
        loading: true,
        loadingError: null,
      });

      try {
        const members = await projectService.getAllMembersForProject(projectId, token);

        if (canceled) return;

        setProjectMembersState({
          ...projectMembersState,
          members,
          loading: false,
          loadingError: null,
        });
      } catch (error) {
        if (canceled) return;

        setProjectMembersState({
          ...projectMembersState,
          loading: false,
          loadingError: error as ApiError,
        });
      }
    }
  }
}