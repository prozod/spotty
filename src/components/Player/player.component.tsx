import { useQuery } from "@tanstack/react-query";
import { playbackService } from "../../services/playback.service";
import PlayerBar from "./playerBar.component";
import PlayerControls from "./playerControls.component";
import PlayerTile from "./playerTile.component";

function Player() {
  const { data } = useQuery(
    [playbackService.playbackState.key],
    playbackService.playbackState.fn,
    {
      refetchInterval: 1000,
    }
  );
  return (
    <div className="grid items-center grid-cols-3 px-4 pt-3 border-t-[1px] border-grack-800">
      <PlayerTile data={data} />
      <PlayerBar playback={data} />
      <PlayerControls />
    </div>
  );
}
export default Player;
