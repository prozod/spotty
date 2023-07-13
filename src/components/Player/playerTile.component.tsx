import { useEffect, useRef, useState } from "react";
import { CurrentlyPlaying, Episode, Track } from "../../types/spotify";

function PlayerTile({
    data,
}: {
    data: CurrentlyPlaying<Track | Episode> | undefined;
}) {
    const [marqueeTrigger, setMarqueeTrigger] = useState<boolean>(false);
    const songNameRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        songNameRef.current !== null &&
            songNameRef?.current?.getBoundingClientRect()?.width > 150
            ? setMarqueeTrigger(true)
            : setMarqueeTrigger(false);
    }, [data?.item?.id]);

    return (
        <div className="text-sm flex gap-2 items-center justify-self-start">
            <div>
                <img
                    src={data?.item?.album?.images[1].url}
                    alt={data?.item?.name}
                    width={55}
                    className="rounded-md"
                />
            </div>
            <div className="hidden md:flex max-w-[280px] flex-col overflow-hidden">
                <p className="flex items-center gap-2 whitespace-nowrap group leading-2 cursor-pointer">
                    <span
                        ref={songNameRef}
                        className={`text-sm font-semibold whitespace-nowrap ${marqueeTrigger && "animate-marquee"
                            } group-hover:underline`}
                    >
                        {data?.item?.name}
                    </span>
                    {marqueeTrigger && (
                        <span
                            className={`text-xs font-semibold whitespace-nowrap  animate-marquee group-hover:underline`}
                        >
                            {data?.item?.name}
                        </span>
                    )}
                </p>

                <p className="line-clamp-1">
                    {data?.item?.artists.map((artist, i) => (
                        <span className="hover:text-red-200 text-gray-400" key={artist?.id}>
                            {data?.item?.artists.length === i + 1
                                ? artist.name
                                : artist.name.concat(", ")}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}
export default PlayerTile;
