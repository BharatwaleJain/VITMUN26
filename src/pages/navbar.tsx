import Link from "next/link";
import Image from "next/image";
import { Karma } from "next/font/google";
import { useState, useEffect } from "react";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import "../app/globals.css";
const karma = Karma({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setDropdownOpen(false);
        }
    };
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            {(isMenuOpen || isDropdownOpen) && (
                <div
                    className={"fixed inset-0 bg-white bg-opacity-50 z-40 backdrop-blur-sm"}
                    onClick={() => {
                        setIsMenuOpen(false);
                        setDropdownOpen(false);
                    }}
                />
            )}
            <nav className={`fixed h-[12vh] w-[100vw] ${karma.className} z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-sm text-foreground" : "bg-transparent"
                }`}
                style={
                    scrolled
                        ? {
                            backgroundImage:
                                'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)), url("/back.png")',
                            backgroundRepeat: "repeat",
                            backgroundSize: "100% auto",
                            backgroundAttachment: "fixed",
                            backgroundPosition: "top center",
                        }
                        : {}
                }>
                <div className="flex flex-row items-center h-full w-full relative px-4 lg:px-16">
                    <Link href="/" className="flex md:hidden">
                        <Image src="/vit-logo.svg" height={150} width={180} alt="VIT Logo" className="w-[150px] md:w-[180px]" />
                    </Link>
                    <button onClick={toggleMenu} className="md:hidden ml-auto">
                        {isMenuOpen ? (
                            <Image src="/cross.svg" height={48} width={48} alt="cross" />
                        ) : (
                            <Menu size={48} />
                        )}
                    </button>
                    {/* Desktop Menu */}
                    <ul className="hidden md:flex w-full justify-between items-center text-[3vh]">
                        <li>
                            <Link href="/">
                                <Image src="/vit-logo.svg" height={150} width={150} alt="VIT Logo" />
                            </Link>
                        </li>
                        <li className="hover:text-[#FF0040]">
                            <Link href="/">HOME</Link>
                        </li>
                        <li className="hover:text-[#FF0040]">
                            <Link href="/committees">COMMITTEES</Link>
                        </li>
                        <li className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="hover:text-[#FF0040] focus:outline-none flex items-center"
                            >
                                RESOURCES
                                {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-[18vw]">
                                    <li className="px-4 py-2 hover:text-[#FF0040]">
                                        <Link href="/brochure" target="_blank" rel="noopener noreferrer">CONFERENCE BROCHURE</Link>
                                    </li>
                                    <li className="px-4 py-2 hover:text-[#FF0040]">
                                        <Link href="/guides" target="_blank" rel="noopener noreferrer">BACKGROUND GUIDES</Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="hover:text-[#FF0040]">
                            <Link href="/allotments" target="_blank" rel="noopener noreferrer">ALLOTMENTS</Link>
                        </li>
                        <li>
                            <Link href="/pay" target="_blank" rel="noopener noreferrer" passHref>
                                <button className={`bg-[#FF0040] w-[10vw] text-[3vh] p-2 text-white rounded-md hover:bg-[#C73C42] transition font-bebas shadow-md shadow-[#FF004080]`}>
                                    PAY NOW
                                </button>
                            </Link>
                        </li>
                    </ul>
                    {/* Mobile Menu */}
                    <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-transparent shadow-lg z-50 h-[90vh]`}>
                        <div className="flex flex-col w-full p-4 text-center items-center justify-center">
                            <ul className="flex flex-col gap-y-8 w-full text-[3.5vh]">
                                <li>
                                    <Link
                                        href="/"
                                        onClick={toggleMenu}
                                        className="hover:text-[#FF0040]"
                                    >
                                        HOME
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/committees"
                                        onClick={toggleMenu}
                                        className="hover:text-[#FF0040]"
                                    >
                                        COMMITTEES
                                    </Link>
                                </li>
                                <li>
                                    <div
                                        className="flex flex-col items-center"
                                        onClick={toggleDropdown}
                                    >
                                        <div className="flex items-center hover:text-[#FF0040]">
                                            RESOURCES
                                            {isDropdownOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </div>
                                        {isDropdownOpen && (
                                            <ul className="mt-2  w-[70vw]">
                                                <li className="px-4 py-2 hover:text-[#FF0040] text-[2.5vh]">
                                                    <Link
                                                        href="/brochure"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu();
                                                        }}
                                                    >
                                                        CONFERENCE BROCHURE
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:text-[#FF0040] text-[2.5vh]">
                                                    <Link
                                                        href="/guides"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu();
                                                        }}
                                                    >
                                                        BACKGROUND GUIDES
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </li>
                                <li>
                                    <Link
                                        href="/allotments"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={toggleMenu}
                                        className="hover:text-[#FF0040]"
                                    >
                                        ALLOTMENTS
                                    </Link>
                                </li>
                            </ul>
                            <Link href="/pay" target="_blank" rel="noopener noreferrer" className="mt-4">
                                <button onClick={toggleMenu} className="bg-[#FF0040] w-full text-[3vh] p-4 text-white rounded-md hover:bg-[#C73C42] transition font-bebas shadow-md shadow-[#FF004080]">
                                    PAY NOW
                                </button>
                            </Link>
                            <div className="mt-[6vh] w-full relative inset-0 rounded-full flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Image
                                        src="/vitmun.svg"
                                        alt="vitmun"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="h-16 w-auto inline select-none mx-auto"
                                    />
                                    <div>
                                        <p className="text-[1.5vh] lg:text-[1.75vh] text-black border border-black justify-center px-4 rounded-3xl select-none italic text-center">
                                            WHERE YOUR VOICE MATTERS
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
