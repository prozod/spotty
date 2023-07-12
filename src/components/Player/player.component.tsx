import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/user.service";
import PlayerBar from "./playerBar.component";
import PlayerControls from "./playerControls.component";
import PlayerTile from "./playerTile.component";

function Player() {
    const { data } = useQuery(
        [userService.userPlaybackState.key],
        userService.userPlaybackState.fn,
        {
            refetchInterval: 1000,
        }
    );
    return (
        <div className="grid items-center grid-cols-3 px-4 rounded-md">
            <PlayerTile data={data} />
            <PlayerBar playback={data} />
            <PlayerControls playback={data} />
        </div>
    );
}
export default Player;
