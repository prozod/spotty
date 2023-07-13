import { GrPlayFill } from "react-icons/gr";

interface ICardProps {
  title: string;
  subtitle: string;
  image: string;
}
export default function Card({ title, subtitle, image }: ICardProps) {
  return (
    <div className="p-4 relative max-w-[190px] rounded-md cursor-pointer hover:bg-grack-700 bg-grack-800 w-fit group">
      <div className="relative mx-auto">
        <img
          src={image}
          alt={subtitle}
          width={155}
          className="rounded-md aspect-square"
        />
        <div className="absolute bottom-0 right-0 items-center justify-center hidden  m-3 text-black rounded-full aspect-square bg-spotify group-hover:flex p-3 text-center">
          <GrPlayFill />
        </div>
      </div>
      <div className="mt-4 mb-2 w-fit overflow-hidden">
        <h1 className="text-sm line-clamp-2">{subtitle}</h1>
        <p className="text-sm text-gray-400 truncate">{title}</p>
      </div>
    </div>
  );
}
