import { useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { BsFillBox2HeartFill } from "react-icons/bs";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiHome, FiSearch } from "react-icons/fi";
import { IoAlbumsOutline, IoTimeOutline } from "react-icons/io5";
import { PiRadio } from "react-icons/pi";
import { SlDrawer } from "react-icons/sl";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
    const location = useLocation();
    const [libVisibility, setLibVisibility] = useState(true);
    const [browseVisibility, setBrowseVisibility] = useState(true);
    return (
        <nav>
            <ul className="flex flex-col gap-4 py-6">
                <button
                    className={`gap-2 flex items-center text-xl ${browseVisibility ? "text-white" : "text-gray-500"
                        } font-bold  pt-2
                        } pl-6 hover:text-white transition-all`}
                    onClick={() => setBrowseVisibility(!browseVisibility)}
                >
                    Browse
                    {browseVisibility ? (
                        <FaChevronUp size={12} />
                    ) : (
                        <FaChevronDown size={12} />
                    )}
                </button>
                {browseVisibility && (
                    <>
                        <Link to="/">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/"
                                        ? "text-spotify font-bold opacity-100"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <FiHome size={22} />
                                Home
                            </li>
                        </Link>

                        <Link to="/featured">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/featured"
                                        ? "text-spotify opacity-100 font-bold"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/featured" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <SlDrawer size={22} />
                                Featured{" "}
                            </li>
                        </Link>
                        <Link to="/episodes">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/episodes"
                                        ? "text-spotify opacity-100 font-bold"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/episodes" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <PiRadio size={22} />
                                Episodes
                            </li>
                        </Link>
                    </>
                )}
                <button
                    className={`gap-2 flex items-center text-xl ${libVisibility ? "text-white" : "text-gray-500"
                        } font-bold  pt-2
                        } pl-6 hover:text-white transition-all`}
                    onClick={() => setLibVisibility(!libVisibility)}
                >
                    Your Library
                    {libVisibility ? (
                        <FaChevronUp size={12} />
                    ) : (
                        <FaChevronDown size={12} />
                    )}
                </button>
                {libVisibility && (
                    <>
                        <Link to="/recents">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/recents"
                                        ? "text-spotify font-bold opacity-100"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/recents" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <IoTimeOutline size={22} />
                                Recently played
                            </li>
                        </Link>

                        <Link to="/collection/liked">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/collection/liked"
                                        ? "text-spotify opacity-100 font-bold"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/collection/liked" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <BsFillBox2HeartFill size={22} />
                                Liked songs
                            </li>
                        </Link>
                        <Link to="/collection/albums">
                            <li
                                className={`relative flex items-center px-6 gap-4 text-sm font-semibold cursor-pointer ${location.pathname === "/collection/albums"
                                        ? "text-spotify opacity-100 font-bold"
                                        : "text-white opacity-70"
                                    } hover:opacity-100 ${location.pathname === "/collection/albums" &&
                                    "before:content-[''] before:absolute before:left-0 before:h-[25px] before:w-[5px] before:bg-spotify"
                                    }`}
                            >
                                <IoAlbumsOutline size={22} />
                                Saved albums
                            </li>
                        </Link>
                    </>
                )}
            </ul>
        </nav>
    );
}