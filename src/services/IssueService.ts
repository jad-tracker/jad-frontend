import {apiClient} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";
import formatDate from "../utils/DateUtils";

export type IssueStatusType = "TODO" | "DOING" | "DONE";
export type IssueTypeType = "STORY" | "TASK" | "BUG";

export interface Issue {
  id: number;
  summary: string;
  description: string;
  type: IssueTypeType;
  status: IssueStatusType;
  date: Date;
  assignee: string;
}

export function mapIssueStatus(status: IssueStatusType): string {
  switch(status){
    case "TODO": return "To Do";
    case "DOING": return "In Progress";
    case "DONE": return "Done";
  }
}

export function isValidIssue(issue: Issue): boolean {
  if (issue.summary.length == 0) return false;
  if (issue.description.length == 0) return false;
  if (issue.assignee.length == 0) return false;
  if (issue.type != "BUG" && issue.type != "TASK" && issue.type != "STORY") return false;
  if (issue.status != "TODO" && issue.status != "DOING" && issue.status != "DONE") return false;
  return true;
}

class IssueService {
  private endpoint = (projectId: number) => `/projects/${projectId}/issues`;


  public async getIssuesForProject(projectId: number, token: string): Promise<Issue[]> {
    try {
      const response = await apiClient.get(
        this.endpoint(projectId),
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


  public async createIssue(projectId: number, summary: string, description: string,
                           type: string, status: string, date: Date, assignee: string, token: string): Promise<Issue> {
    try {
      const response = await apiClient.post(
        this.endpoint(projectId),
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

  public async updateIssue(projectId: number, issueId: number, summary: string, description: string,
                           type: string, status: string, date: Date, assignee: string, token: string): Promise<Issue> {
    try {
      const response = await apiClient.put(
        this.endpoint(projectId) + `/${issueId}`,
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

  public async deleteIssue(projectId: number, issueId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        this.endpoint(projectId) + `/${issueId}`,
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
