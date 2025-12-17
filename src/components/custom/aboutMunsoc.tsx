import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
const latoThin = Inter({ subsets: ["latin"], weight: "400" });
const latoBold = Inter({ subsets: ["latin"], weight: "900" });
const AboutMunsoc = () => {
    return (
        <div className="text-black font-medium text-xl">
            <div className="w-[90%] mx-auto py-24 flex flex-col gap-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ translateY: -40, opacity: 0 }}
                        whileInView={{ translateY: 0, opacity: 1 }}
                        transition={{ duration: 0.75, delay: 0.25 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className={`text-2xl md:text-4xl mb-4 ${latoBold.className}`}
                        >
                            WE ARE VITMUNSOC
                        </h2>
                        <p className={`text-sm md:text-lg leading-relaxed ${latoThin.className}`}>
                            The VIT Model United Nations Society (VITMUNSoc) is a model of excellence, teaching argumentation, diplomacy, public speaking and more to its members and the VIT student community.
                            <br />
                            <br />
                            It has become one of India's top MUN societies, winning awards with each effort.
                        </p>
                    </motion.div>
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.75 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="/img1.svg"
                            alt="VITMUN 1"
                            draggable="false"
                            width={600}
                            height={300}
                            className="rounded-xl border-4 border-[#C73C42] shadow-xl shadow-[#FF004033]"
                        />
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.75 }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="/img2.svg"
                            alt="VITMUN 2"
                            draggable="false"
                            width={600}
                            height={300}
                            className="rounded-xl border-4 border-[#C73C42] shadow-xl shadow-[#FF004033]"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ translateY: -40, opacity: 0 }}
                        whileInView={{ translateY: 0, opacity: 1 }}
                        transition={{ duration: 0.75, delay: 0.25 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className={`text-2xl md:text-4xl mb-4 ${latoBold.className}`}
                        >
                            DELEGATE AT VITMUN
                        </h2>
                        <p className={`text-sm md:text-lg leading-relaxed ${latoThin.className}`}>
                            Choose VITMUN'26 for immersive simulations, skill refinement and cultural awareness. Elevate your leadership potential amidst a diverse cohort.
                            <br />
                            With extensive exposure and industry engagement, it’s more than just a conference.
                            <br />
                            It’s a pathway to global impact and personal growth.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
export default AboutMunsoc;