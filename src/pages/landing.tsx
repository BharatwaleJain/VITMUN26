"use client";
import NextImage from "next/image";
import React, { useState, useEffect } from "react";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Marquee from "@/components/custom/marquee";
import Link from "next/link";
const Loader = () => (
    <div className="flex items-center justify-center h-screen w-screen">
        <div className="spinner"></div>
        <style jsx>{`
      .spinner {
        border: 8px solid rgba(0, 0, 0, 0.1);
        border-top: 8px solid #0070f3;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
    </div>
);
const Landing = ({ onLoad }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const imageSources = [
        "/globe.svg",
        "/date.svg",
        "/vitmun.svg",
        "/house.svg",
    ];
    useEffect(() => {
        const loadImages = async () => {
            try {
                const promises: Promise<void>[] = imageSources.map((src) => {
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve();
                        img.onerror = () => {
                            console.warn(`Failed to load image: ${src}`);
                            resolve();
                        };
                    });
                });
                await Promise.all(promises);
                setLoading(false);
                onLoad();
            } catch (error) {
                console.error('Error loading images:', error);
                setLoading(false);
                onLoad();
            }
        };
        loadImages();
    }, [imageSources, onLoad]);
    const handleInd = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative py-[5vh] h-[100vh] max-w-[100vw] overflow-hidden overflow-x-hidden">
                    <div className="relative flex flex-col items-center w-full">
                        <div className="mt-[4vh] flex flex-col items-center justify-center text-[8vh]">
                            <NextImage
                                src="/globe.svg"
                                alt="globe"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-56 mt-[4vh] mb-[2vh] w-auto inline select-none mx-auto"
                            />
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-[2vh] lg:text-[3vh] font-bebas">Office of Students' Welfare</p>
                                <p className="text-[1.2vh] lg:text-[1.8vh] font-bebas">presents</p>
                                <NextImage
                                    src="/vitmun.svg"
                                    alt="vitmun"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="h-16 w-auto inline select-none mx-auto"
                                />
                                <p className="text-[1.5vh] lg:text-[1.75vh] text-black border border-black justify-center px-4 rounded-3xl select-none italic text-center">
                                    WHERE YOUR VOICE MATTERS
                                </p>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-y-0 lg:gap-x-8 lg:font-semibold relative justify-center items-center text-white">
                                <div className="z-10 ">
                                    <button
                                        onClick={handleInd}
                                        className="font-bebas text-[2.5vh] lg:text-[3.5vh] bg-[#FF0040] py-1 px-6 lg:px-8 border rounded-3xl z-10 shadow-2xl hover:bg-[#C73C42]"
                                    >
                                        INDIVIDUAL REGISTRATION
                                    </button>
                                </div>
                                <div className="z-10 -mt-[4vh] lg:mt-0">
                                    <Link href="/registrations/delegation">
                                        <button className="font-bebas text-[2.5vh] lg:text-[3.5vh] bg-[#FF0040] py-1 px-5 lg:px-8 border rounded-3xl z-30 shadow-2xl gap-y-0 hover:bg-[#C73C42]">
                                            DELEGATION REGISTRATION
                                        </button>
                                    </Link>
                                </div>
                                {showPopup && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                                        <div className="relative bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-lg h-[30vh] lg:h-[40vh] flex flex-row justify-center items-center">
                                            <button
                                                className="absolute top-4 right-4 text-gray-400"
                                                onClick={closePopup}
                                            >
                                                <NextImage
                                                    src="/cross.svg"
                                                    width={56}
                                                    height={56}
                                                    alt="Close"
                                                />
                                            </button>
                                            <div className="mt-[5vh] flex flex-col justify-center items-center space-y-8 text-[2.5vh] lg:text-[4.5vh] ">
                                                <Link href="/registrations/internal">
                                                    <button className="font-bebas bg-[#FF0040] py-2 px-8 border rounded-3xl z-10 hover:bg-[#C73C42]">
                                                        VIT VELLORE STUDENT
                                                    </button>
                                                </Link>
                                                <Link href="/registrations/external">
                                                    <button className="font-bebas bg-[#FF0040] py-2 px-8 border rounded-3xl z-10 hover:bg-[#C73C42]">
                                                        EXTERNAL PARTICIPANT
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <NextImage
                                src="/date.svg"
                                alt="date"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="mt-4 h-12 w-auto inline select-none mx-auto"
                            />
                        </div>
                    </div>
                    <NextImage
                        src="/house.svg"
                        alt="house"
                        width={960}
                        height={540}
                        className="h-[20vh] max-w-[60vw] lg:h-[50vh] lg:max-w-[30vw] absolute bottom-[5vh] lg:bottom-[1vh] -left-28 z-0 overflow-hidden"
                    />
                    <NextImage
                        src="/house.svg"
                        alt="house"
                        width={960}
                        height={540}
                        className="h-[20vh] max-w-[60vw] lg:h-[50vh] lg:max-w-[30vw] absolute bottom-[5vh] lg:bottom-[1vh] transform scale-x-[-1] -right-28 z-0 overflow-hidden"
                    />
                    <div className="absolute h-[5vh] lg:h-[6vh] bottom-0 w-full z-0 py-0 bg-[#FF0040]">
                        <Marquee text1="VITMUN'26" text2="WHERE YOUR VOICE MATTERS" />
                    </div>
                </div>
            )}
        </>
    );
};
export default Landing;
