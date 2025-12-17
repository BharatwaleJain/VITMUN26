import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lato } from "next/font/google";
const latoThin = Lato({ subsets: ["latin"], weight: "400" });
const latoBold = Lato({ subsets: ["latin"], weight: "900" });
const NeedHelp = () => {
    return (
        <>
            <div className={`text-black  font-medium text-xl font-cereal`}>
                <div className="w-[80%] mx-auto container flex  py-12 md:flex-row flex-col items-center">
                    <section className="w-full md:w-[60%]">
                        <div className="wrapper md:w-[70%] text-sm md:text-lg">
                            <motion.div
                                className={`text-3xl md:text-5xl mb-6 ${latoBold.className}`}
                                initial={{ translateY: -40, opacity: 0 }}
                                whileInView={{ translateY: 0, opacity: 1 }}
                                transition={{ duration: 0.75, delay: 0.25 }}
                                viewport={{ once: true }}
                            >
                                Need Help?
                            </motion.div>
                            <motion.div
                                className={`mb-4 md:mb-8 leading-6 md:leading-relaxed ${latoThin.className}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                We&apos;re here to help. Reach out to us via our official
                                <span className="text-[#FF0040] font-bold">
                                    &nbsp;
                                    <a
                                        href="https://www.instagram.com/vitmunsoc?igsh=dDF6bWVoOGxmdW5i"
                                        target="_blank"
                                    >
                                        Instagram
                                    </a>
                                    ,{" "}
                                    <a
                                        href="https://www.linkedin.com/company/munsocvit/"
                                        target="_blank"
                                    >
                                        LinkedIn
                                    </a>
                                    &nbsp;
                                </span>
                                and{" "}
                                <span className="text-[#FF0040] font-bold">
                                    <a
                                        href="mailto:help.delegateaffairs@gmail.com"
                                        target="_blank"
                                    >
                                        Email
                                    </a>
                                    .
                                </span>
                            </motion.div>
                            <motion.div
                                className={`mb-4 md:mb-8 leading-6 md:leading-relaxed ${latoThin.className}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                If you require any help with the registration process or
                                delegate affairs, you can mail at:
                            </motion.div>
                            <motion.div
                                className={`mb-4 md:mb-8 leading-6 md:leading-relaxed ${latoBold.className} text-[#FF0040]`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <a href="mailto:help.delegateaffairs@gmail.com" target="_blank">
                                    help.delegateaffairs@gmail.com
                                </a>
                            </motion.div>
                        </div>
                    </section>
                    <motion.section
                        className="--qr-wrapper md:w-[40%]"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-[60%] md:w-[70%] mx-auto h-[80%] border-2 border-[#FF0040] p-2 md:p-4 rounded-2xl">
                            <Image
                                width={500}
                                height={500}
                                alt="QR-CODE"
                                src="/qr.svg"
                                draggable="false"
                                className="w-full h-full"
                            />
                        </div>
                    </motion.section>
                </div>
            </div>
        </>
    );
};
export default NeedHelp;
