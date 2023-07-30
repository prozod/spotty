import { GrPlayFill } from "react-icons/gr";
import { Link } from "react-router-dom";

interface ICardProps {
  title?: string;
  subtitle?: string;
  image: string;
  type?: string;
  id?: string;
}
export default function Card({ title, subtitle, image, type, id }: ICardProps) {
  return (
    <Link
      to={(type === "playlist" && `/playlist/${id}`) || "#"}
      className="p-4 relative w-[190px] truncate rounded-md cursor-pointer hover:bg-grack-700 bg-grack-800 w-fit group"
    >
      <div className="relative mx-auto">
        <img
          src={image}
          alt={subtitle}
          width={160}
          height={160}
          className="rounded-md aspect-square"
        />
        <div className="absolute bottom-0 right-0 items-center justify-center hidden  m-3 text-black rounded-full aspect-square bg-spotify group-hover:flex p-3 text-center">
          <GrPlayFill />
        </div>
      </div>
      <div className="mt-4 mb-2 overflow-hidden relative">
        <h1 className="truncate text-sm line-clamp-1">{subtitle}</h1>
        <p className="text-sm text-gray-400 truncate line-clamp-1">{title}</p>
      </div>
    </Link>
  );
}
