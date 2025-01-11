import * as React from 'react';
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RequireAuth from "./components/auth/RequireAuth";
import RequireNotAuth from "./components/auth/RequireNotAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="*" element={<ErrorPage />}/>,

    <Route path="/" element={<Navigate to="/projects" />} />,
    <Route element={<RequireNotAuth />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>,

    <Route element={<RequireAuth />}>
      <Route path="/projects" element={<MainPage />}/>
    </Route>
  ])
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
