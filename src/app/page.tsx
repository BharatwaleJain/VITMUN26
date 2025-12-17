"use client";
import { useState } from 'react';
import NeedHelp from "@/components/custom/needHelp";
import Landing from "../pages/landing";
import Navbar from "../pages/navbar";
import AboutMunsoc from "@/components/custom/aboutMunsoc";
export default function Home() {
    const [isLandingLoaded, setIsLandingLoaded] = useState(false);
    const handleLandingLoad = () => {
        setIsLandingLoaded(true);
    };
    return (
        <div>
            {isLandingLoaded && (
                <>
                    <Navbar />
                </>
            )}
            <Landing onLoad={handleLandingLoad} />
            {isLandingLoaded && (
                <>
                    <AboutMunsoc />
                    <NeedHelp />
                </>
            )}
        </div>
    );
}