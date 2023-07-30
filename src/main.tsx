import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import "./index.css";
import Albums from "./views/Albums/albums.view";
import CollectionLiked from "./views/Collection/liked.view";
import Playlist from "./views/Collection/playlist.view";
import Featured from "./views/Featured/featured.view";
import Home from "./views/Home/home.view";
import Login from "./views/Login/login.view";
import Queue from "./views/Queue/queue.view";
import Recents from "./views/Recents/recents.view";
import Search from "./views/Search/search.view";
import Shows from "./views/Shows/shows.view";

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
        path: "/collection/recent",
        element: <Recents />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/collection/albums",
        element: <Albums />,
        errorElement: <ErrorPage />,
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
      {
        path: "/featured",
        element: <Featured />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/episodes",
        element: <Shows />,
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
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS>
        <Notifications position="top-right" zIndex={2077} />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
