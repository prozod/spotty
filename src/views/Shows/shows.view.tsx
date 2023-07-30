import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import Card from "../../components/Card/card.component";
import { trackService } from "../../services/track.service";
import useUserStore from "../../store/user.store";
import { Show } from "../../types/spotify";

function Shows() {
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);
  const { data: shows } = useQuery(
    [trackService.savedShows.key],
    trackService.savedShows.fn,
    {
      enabled: loggedIn,
    }
  );
  console.log(shows);
  return (
    <section className="m-6">
      <h1 className="font-bold mb-4">Your preferred shows</h1>
      <div className="flex flex-wrap gap-2 relative overflow-hidden">
        {shows?.items?.map(({ show }: { show: Show }) => {
          return (
            <Card
              key={show.id}
              title={show?.name}
              subtitle={show?.publisher}
              image={show?.images[0]?.url}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Shows;
