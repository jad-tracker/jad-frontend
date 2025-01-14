import {Project} from "./ProjectService";
import {apiClient} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";
import formatDate from "../utils/DateUtils";
import {Issue} from "./IssueService";

export interface Comment {
  id: number | undefined;
  content: string;
  date: Date;
  username: string;
}

class CommentService {
  private endpoint = (issue: Issue) => `/issues/${issue.id}/comments`;


  public async getCommentsForIssue(issue: Issue, token: string): Promise<Comment[]> {
    try {
      const response = await apiClient.get(
        this.endpoint(issue),
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


  public async createComment(issue: Issue, content: string, date: Date, token: string): Promise<Comment> {
    try {
      const response = await apiClient.post(
        this.endpoint(issue),
        {
          content,
          date: formatDate(new Date(date)),
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

  public async updateComment(issue: Issue, commentId: number, content: string, date: Date, token: string): Promise<Comment> {
    try {
      const response = await apiClient.put(
        this.endpoint(issue) + `/${commentId}`,
        {
          content,
          date: formatDate(new Date(date)),
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

  public async deleteComment(issue: Issue, commentId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        this.endpoint(issue) + `/${commentId}`,
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

export const commentService = new CommentService();
