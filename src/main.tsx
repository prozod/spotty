import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import "./index.css";
import CollectionLiked from "./views/Collection/liked.view";
import Playlist from "./views/Collection/playlist.view";
import Home from "./views/Home/home.view";
import Login from "./views/Login/login.view";
import Search from "./views/Search/search.view";
import Queue from "./views/Queue/queue.view";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/collection/liked",
        element: <CollectionLiked />,
      },
      {
        path: "/playlist/:id",
        element: <Playlist />,
      },
      {
        path: "/queue",
        element: <Queue />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
