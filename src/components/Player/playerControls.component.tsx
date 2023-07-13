import { Menu } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AiOutlineLaptop } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { GiSmartphone } from "react-icons/gi";
import { IoVolumeHigh } from "react-icons/io5";
import { LuLaptop2, LuSpeaker } from "react-icons/lu";
import { PiWaveform } from "react-icons/pi";
import { shallow } from "zustand/shallow";
import {
  playbackService,
  transferPlayback,
} from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import { Device } from "../../types/spotify";

function PlayerControls() {
  const [vol, setVol] = useState(0);
  const [activeBtn, setActiveBtn] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [player, updateDevices] = usePlaybackStore(
    (state) => [state.player, state.updateDevices],
    shallow
  );

  const { data } = useQuery(
    [playbackService.devices.key],
    playbackService.devices.fn
  );

  useEffect(() => {
    updateDevices(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  player?.getVolume().then((volume: number) => {
    setVol(volume * 100);
  });

  const transfer = useMutation({
    mutationFn: (id) => transferPlayback({ device_id: id }),
  });

  function deviceType(device: Device) {
    if (device.type === "Computer") {
      return (
        <Menu.Item
          key={device.id}
          className="text-white hover:bg-grack-600"
          icon={<AiOutlineLaptop size={22} />}
          data-deviceid={device.id}
          onClick={() => transfer.mutate(device.id)}
        >
          {device.name}
        </Menu.Item>
      );
    } else if (device.type === "Smartphone") {
      return (
        <Menu.Item
          key={device.id}
          className="text-white hover:bg-grack-600"
          icon={<GiSmartphone size={22} />}
          data-deviceid={device.id}
          onClick={() => transfer.mutate(device.id)}
        >
          {device.name}
        </Menu.Item>
      );
    } else {
      return (
        <Menu.Item
          key={device.id}
          className="text-white hover:bg-grack-600"
          icon={<LuSpeaker size={22} />}
          data-deviceid={device.id}
          onClick={() => transfer.mutate(device.id)}
        >
          {device.name}
        </Menu.Item>
      );
    }
  }

  return (
    <div className="flex items-center gap-4 justify-self-end">
      <Menu shadow="md" width={280}>
        <Menu.Target>
          <button
            ref="playbackDevRef"
            onClick={(e) =>
              setActiveBtn(
                () =>
                  e?.target?.parentNode?.getAttribute("aria-expanded") ===
                  "true"
              )
            }
          >
            <LuLaptop2
              size={18}
              className={`${activeBtn ? "text-white" : "text-spotify"}`}
            />
          </button>
        </Menu.Target>

        <Menu.Dropdown className="p-4 bg-grack-800 border-[1px] shadow-md border-solid border-grack-700">
          <Menu.Item
            icon={<PiWaveform size={24} className="text-spotify" />}
            color="white"
            className="font-bold text-xl flex gap-4 hover:bg-grack-600 items-center"
          >
            Current device
            {data?.devices?.map(
              (device) =>
                device.is_active && (
                  <p
                    key={device.name}
                    className="text-spotify text-xs font-medium"
                  >
                    {device.name}
                  </p>
                )
            )}
          </Menu.Item>
          <Menu.Label className="text-white text-lg">
            Select another device
          </Menu.Label>
          {data?.devices?.map((device) => deviceType(device))}
          <a
            href="https://support.spotify.com/article/spotify-connect"
            target="_blank"
            rel="noreferrer"
            className="flex justify-between items-center hover:bg-grack-600 pr-2 rounded-md py-1"
          >
            <Menu.Item className="text-white  hover:bg-grack-600 flex justify-between items-center">
              Don't see your device?
            </Menu.Item>
            <BiLinkExternal size={24} />
          </a>
        </Menu.Dropdown>
      </Menu>
      <div className="flex gap-2 items-center">
        <IoVolumeHigh size={22} />
        <span
          className="group w-[10vw] lg:w-[6vw] relative cursor-pointer flex gap-8 items-center [&>*:rounded-md]"
          id="playbar"
        >
          <label
            htmlFor="volume"
            className="hidden absolute text-spotify text-xs inset-x-1/4 bottom-3  ml-2 group-hover:inline-flex"
          >
            {vol.toFixed(1)}%
          </label>
          <input
            name="volume"
            type="range"
            min={0}
            max={100}
            step="0.001"
            value={vol}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: `linear-gradient( to right, ${
                hovered ? "#1ed760" : "#fff"
              } 0%, ${hovered ? "#1ed760" : "#fff"} ${vol.toFixed(
                1
              )}%, #282828 ${vol.toFixed(1)}%, #282828 100%)`,
            }}
            onChange={(e) => {
              player.setVolume(+e?.target?.value / 100);
              setVol(() => +e?.target?.value);
            }}
          />
        </span>
      </div>
    </div>
  );
}
export default PlayerControls;
