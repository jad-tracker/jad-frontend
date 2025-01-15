import {createContext, ReactNode, useEffect, useReducer} from "react";
import {UserComment, commentService} from "../../services/CommentService";
import useAuth from "../../hooks/auth/useAuth";
import {IssueActionContext, IssueContext} from "../issues/IssueProvider";

interface CommentProviderProps {
  issueId: number,
  children: ReactNode
}

interface CommentActions {
  addComment: (issueId: number, comment: UserComment) => void;
  updateComment: (issueId: number, comment: UserComment) => void;
  deleteComment: (issueId: number, comment: UserComment) => void;
}

const voidCommentActions: CommentActions = {
  addComment: () => {},
  updateComment: () => {},
  deleteComment: () => {},
}

export const CommentContext = createContext<UserComment[]>([]);
export const CommentActionContext = createContext<CommentActions>(voidCommentActions);

export default function CommentProvider({issueId, children}: CommentProviderProps) {
  const [comments, dispatch] = useReducer(commentReducer, []);
  const {token} = useAuth();

  useEffect(() => {
    commentService.getCommentsForIssue(issueId, token)
      .then(savedComments => {
        dispatch({
          type: "set-all",
          payload: savedComments
        })
      });
  }, [issueId])

  const commentActions: CommentActions = {
    addComment: (issueId, comment) => {
      commentService.createComment(issueId, comment.content, comment.date, token)
        .then(savedComment => dispatch({
          type: "add",
          payload: savedComment,
        }))
    },

    updateComment: (issueId, comment) => {
      commentService.updateComment(issueId, comment.id, comment.content, comment.date, token)
        .then(savedComment => dispatch({
          type: "update",
          payload: savedComment,
        }))
    },

    deleteComment: (issueId, comment) => {
      commentService.deleteComment(issueId, comment.id, token).then(() => {
        dispatch({
          type: "delete",
          payload: comment
        })
      })
    }
  }


  return (
    <CommentContext.Provider value={comments}>
      <CommentActionContext.Provider value={commentActions}>
        {children}
      </CommentActionContext.Provider>
    </CommentContext.Provider>
  );
}

export interface CommentReducerAction {
  type: "add" | "update" | "delete" | "set-all",
  payload: any,
}

function commentReducer(comments: UserComment[], action: CommentReducerAction): UserComment[] {
  switch(action.type) {
    case "add": {
      return [...comments, action.payload];
    }

    case "set-all": {
      return action.payload;
    }

    case "update": {
      return comments.map(com => {
        if (com.id == action.payload.id) {
          return action.payload;
        } else {
          return com;
        }
      })
    }

    case "delete": {
      return comments.filter(com => com.id !== action.payload.id);
    }

    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}