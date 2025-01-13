import {apiClient} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";
import {Project} from "./ProjectService";
import formatDate from "../utils/DateUtils";

export interface Issue {
  id: number;
  summary: string;
  description: string;
  type: string;
  status: string;
  date: Date;
  assignee: string;
}

class IssueService {
  private endpoint = (project: Project) => `/projects/${project.id}/issues`;


  public async getIssuesForProject(project: Project, token: string): Promise<Issue[]> {
    try {
      const response = await apiClient.get(
        this.endpoint(project),
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


  public async createIssue(project: Project, summary: string, description: string,
                           type: string, status: string, date: Date, assignee: string, token: string): Promise<Issue> {
    try {
      const response = await apiClient.post(
        this.endpoint(project),
        {
          summary,
          description,
          type: type.toUpperCase(),
          status: status.toUpperCase(),
          date: formatDate(new Date(date)),
          assignee,
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

  public async updateIssue(project: Project, issueId: number, summary: string, description: string,
                           type: string, status: string, date: Date, assignee: string, token: string): Promise<Issue> {
    try {
      const response = await apiClient.put(
        this.endpoint(project) + `/${issueId}`,
        {
          summary,
          description,
          type: type.toUpperCase(),
          status: status.toUpperCase(),
          date: formatDate(new Date(date)),
          assignee,
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

  public async deleteIssue(project: Project, issueId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        this.endpoint(project) + `/${issueId}`,
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

export const issueService = new IssueService();
