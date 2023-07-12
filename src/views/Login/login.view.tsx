import { FaGithub } from "react-icons/fa";
import useUnauthorizedState from "../../utils/useUnauthorizedState";
export default function Login() {
  useUnauthorizedState();
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-t from-grack-900 to-grack-800">
      <button className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 m-8 font-mono text-xs font-bold bg-white rounded-md text-black/80">
        <FaGithub size={20} />
        {`<SourceCode/>`}
      </button>
      <div className="p-12 gap-4 rounded-lg bg-grack-900 flex flex-wrap flex-col min-w-[400px] max-w-[500px] items-center justify-center">
        <h1 className="text-3xl font-bold">Log in to Spotify</h1>
        <p className="text-sm text-center opacity-80">
          This will redirect you to the official Spotify page, please authorize
          access in order to proceed further.
        </p>
        <hr />
        <button
          onClick={() => window.location.replace("http://localhost:3000/login")}
          className="w-full py-4 font-semibold text-black rounded-full bg-spotify"
        >
          Log In
        </button>
      </div>
      <p className="mt-6 text-sm text-white text-opacity-80 max-w-[500px] text-center">
        <strong className="text-yellow-400 rounded-sm">INFO: </strong>
        The <strong>Web Playback SDK</strong> which facilitates the audio
        playback for this web application requires{" "}
        <a href="https://www.spotify.com/premium/" rel="noreferrer">
          <strong className="underline">Spotify Premium</strong>
        </a>
        .
      </p>
    </div>
  );
}
