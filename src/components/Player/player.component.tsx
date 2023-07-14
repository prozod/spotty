import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { playbackService } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import PlayerBar from "./playerBar.component";
import PlayerControls from "./playerControls.component";
import PlayerTile from "./playerTile.component";
import useUserStore from "../../store/user.store";

function Player() {
  const [updatePlaybackState] = usePlaybackStore(
    (state) => [state.updatePlaybackState],
    shallow
  );
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);

  const { data } = useQuery(
    [playbackService.playbackState.key],
    playbackService.playbackState.fn,
    {
      refetchInterval: 1000,
      enabled: loggedIn,
    }
  );

  useEffect(() => {
    updatePlaybackState(data);
  }, [data]);

  return (
    <div className="grid items-center grid-cols-3 px-4 pt-3">
      <PlayerTile />
      <PlayerBar />
      <PlayerControls />
    </div>
  );
}
export default Player;
