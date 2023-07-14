import Library from "./Library/library.component";
import Navigation from "./Navigation/navigation.component";

export default function Sidebar() {
  return (
    <section className="flex flex-col h-full">
      <img
        src="/SpotifyLogoRGB.png"
        className="w-40 mx-6 mt-6"
        alt="spotify-logo"
      />
      <Navigation />
      <Library />
    </section>
  );
}
