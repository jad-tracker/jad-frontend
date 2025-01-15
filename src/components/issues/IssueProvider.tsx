import {createContext, ReactNode, useEffect, useReducer} from "react";
import {Issue, issueService} from "../../services/IssueService";
import useAuth from "../../hooks/auth/useAuth";

interface IssueProviderProps {
  projectId: number;
  children: ReactNode;
}

interface IssueActions {
  addIssue: (projectId:number, issue: Issue) => void;
  updateIssue: (projectId:number, issue: Issue) => void;
  deleteIssue: (projectId:number, issue: Issue) => void;
}

const voidIssueActions: IssueActions = {
  addIssue: () => {},
  updateIssue: () => {},
  deleteIssue: () => {},
}


export const IssueContext = createContext<Issue[]>([]);
export const IssueActionContext = createContext<IssueActions>(voidIssueActions);

export default function IssueProvider({projectId, children}: IssueProviderProps) {
  const [issues, dispatch] = useReducer(issueReducer, []);
  const {token} = useAuth();

  useEffect(() => {
    issueService.getIssuesForProject(projectId, token)
      .then(savedIssues => {
        dispatch({
          type: "set-all",
          payload: savedIssues
        })
      });
  }, [projectId])

  const issueActions: IssueActions = {
    addIssue: (projectId, newIssue) => {
      issueService.createIssue(
        projectId, newIssue.summary, newIssue.description, newIssue.type,
        newIssue.status, newIssue.date, newIssue.assignee, token
      ).then(savedIssue => dispatch({
        type: "add",
        payload: savedIssue,
      }))
    },

    updateIssue: (projectId, updatedIssue) => {
      issueService.updateIssue(
        projectId, updatedIssue.id, updatedIssue.summary, updatedIssue.description, updatedIssue.type,
        updatedIssue.status, updatedIssue.date, updatedIssue.assignee, token
      ).then(savedIssue => dispatch({
        type: "update",
        payload: savedIssue,
      }))
    },

    deleteIssue: (projectId, issue) => {
      issueService.deleteIssue(projectId, issue.id, token).then(() => {
        dispatch({
          type: "delete",
          payload: issue
        })
      })
    }
  }

  return (
    <IssueContext.Provider value={issues}>
      <IssueActionContext.Provider value={issueActions}>
        {children}
      </IssueActionContext.Provider>
    </IssueContext.Provider>
  );
}

export interface IssueReducerAction {
  type: "add" | "update" | "delete" | "set-all",
  payload: any,
}


function issueReducer(issues: Issue[], action: IssueReducerAction): Issue[] {
  switch(action.type) {
    case "add": {
      return [...issues, action.payload];
    }

    case "set-all": {
      return action.payload;
    }

    case "update": {
      return issues.map(i => {
        if (i.id == action.payload.id) {
          return action.payload;
        } else {
          return i;
        }
      })
    }

    case "delete": {
      return issues.filter(i => i.id !== action.payload.id);
    }

    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}