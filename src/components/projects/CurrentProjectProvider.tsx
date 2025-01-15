import {createContext, ReactNode} from "react";
import {Project} from "../../services/ProjectService";

export const CurrentProjectContext = createContext<Project | undefined>(undefined)

interface CurrentProjectProviderProps {
  project: Project | undefined,
  children: ReactNode
}

export default function CurrentProjectProvider({project, children}: CurrentProjectProviderProps) {
  return (
    <CurrentProjectContext.Provider value={project}>
      {children}
    </CurrentProjectContext.Provider>
  )
}