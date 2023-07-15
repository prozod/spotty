import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import useUserStore from "../store/user.store";

function useUnauthorizedState() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = document.cookie.split("access_token=")[1];
  const [updateAccessToken, updateLoginState] = useUserStore(
    (state) => [state.updateAccessToken, state.updateLoginState],
    shallow
  );
  useEffect(() => {
    updateAccessToken(token);
    updateLoginState(token ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token && location.pathname !== "/login") {
      console.warn(
        `SPOTIFY RECONSTRUCTED: Your access token might be invalid, either way, you're not allowed to visit '${location}'. Please try logging in again.`
      );
      navigate("/login");
    }

    if (location.pathname === "/login" && token) {
      console.warn(
        `SPOTIFY RECONSTRUCTED: You are already logged in or an 'access_token' is already stored in your cookies, therefore accessing '${location}' is forbidden and you will be redirected.`
      );
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}

export default useUnauthorizedState;
