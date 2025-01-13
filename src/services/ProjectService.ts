import {apiClient,} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";

export interface Project {
  id: number;
  name: string;
  description: string;
  lead: string;
}

export interface ProjectMember {
  userId: number;
  username: string;
  role: string;
}


class ProjectService {
  private endpoint = "/projects";

  public async getAll(token: string): Promise<Project[]> {
    try {
      const response = await apiClient.get(
        this.endpoint,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async createProject(name: string, description: string, token: string): Promise<Project> {
    try {
      const response = await apiClient.post(
        this.endpoint,
        {
          name,
          description,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async renameProject(projectId: number, name: string, token: string): Promise<Project> {
    try {
      const response = await apiClient.put(
        `${this.endpoint}/${projectId}`,
        {
          name,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async deleteProject(projectId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        `${this.endpoint}/${projectId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async getAllMembersForProject(projectId: number, token: string): Promise<ProjectMember[]> {
    try {
      const response = await apiClient.get(
        `${this.endpoint}/${projectId}/members`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async addMemberToProject(projectId: number, username: string, role: string, token: string): Promise<ProjectMember> {
    try {
      const response = await apiClient.post(
        `${this.endpoint}/${projectId}/members`,
        {
          username,
          role,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async removeMemberFromProject(projectId: number, userId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        `${this.endpoint}/${projectId}/members/${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }
}

export const projectService = new ProjectService();