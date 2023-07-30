import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";
import useUserStore from "../store/user.store";

function useUnauthorizedState() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query_token = searchParams.get("token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const stored_token = document.cookie.split("access_token=")[1];
  const [updateAccessToken, updateLoginState] = useUserStore(
    (state) => [state.updateAccessToken, state.updateLoginState],
    shallow
  );
  const expiry = new Date(Date.now() + 3590 * 1000).toUTCString();
  if (query_token) {
    document.cookie = `access_token=${query_token};expires=${expiry};Secure`;
  }
  useEffect(() => {
    updateAccessToken(stored_token as string);
    updateLoginState(stored_token ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query_token]);

  useEffect(() => {
    if (!stored_token && location.pathname !== "/login") {
      console.warn(
        `SPOTIFY RECONSTRUCTED: Your access token might be invalid, either way, you're not allowed to visit '${location.pathname}'. Please try logging in again.`
      );
      navigate("/login");
      queryClient.invalidateQueries();
      queryClient.cancelQueries();
    }

    if (location.pathname === "/login" && stored_token) {
      console.warn(
        `SPOTIFY RECONSTRUCTED: You are already logged in or an 'access_token' is already stored in your cookies, therefore accessing '${location.pathname}' is forbidden and you will be redirected.`
      );
      navigate("/");
    }

    if (stored_token && searchParams.get("token")) {
      console.warn(
        `SPOTIFY RECONSTRUCTED: You are being redirected to your dashboard.`
      );
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored_token]);
}

export default useUnauthorizedState;
