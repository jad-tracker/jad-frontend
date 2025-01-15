import {apiClient} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";
import formatDate from "../utils/DateUtils";

export interface UserComment {
  id: number;
  content: string;
  date: Date;
  username: string;
}

class CommentService {
  private endpoint = (issueId: number) => `/issues/${issueId}/comments`;


  public async getCommentsForIssue(issueId: number, token: string): Promise<UserComment[]> {
    try {
      const response = await apiClient.get(
        this.endpoint(issueId),
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


  public async createComment(issueId: number, content: string, date: Date, token: string): Promise<UserComment> {
    try {
      const response = await apiClient.post(
        this.endpoint(issueId),
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

  public async updateComment(issueId: number, commentId: number, content: string, date: Date, token: string): Promise<UserComment> {
    try {
      const response = await apiClient.put(
        this.endpoint(issueId) + `/${commentId}`,
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

  public async deleteComment(issueId: number, commentId: number, token: string): Promise<void> {
    try {
      await apiClient.delete(
        this.endpoint(issueId) + `/${commentId}`,
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
