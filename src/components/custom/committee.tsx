import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lato } from "next/font/google";
const latoBold = Lato({ subsets: ["latin"], weight: "900" });
interface CommitteeCardProps {
    imageWhite: string;
    imageBlack: string;
    name: string;
    onClick: () => void;
    isSelected: boolean;
}
const CommitteeCard = ({
    imageWhite,
    imageBlack,
    name,
    onClick,
}: CommitteeCardProps) => {
    return (
        <motion.div
            className={`group flex flex-col items-center cursor-pointer transition duration-300 py-5 lg:py-6 mx-20 rounded-md `}
            onClick={onClick}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
        >
            <h3 className={`text-lg font-semibold text-center ${latoBold.className}`}>{name}</h3>
            <div className="w-48 h-48 mt-2 relative">
                <Image
                    src={imageWhite}
                    alt={`${name} white`}
                    width={192}
                    height={192}
                    className="absolute w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0 group-hover:invisible"
                />
                <Image
                    src={imageBlack}
                    alt={`${name} black`}
                    width={192}
                    height={192}
                    className="absolute w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-100 group-hover:visible opacity-0 invisible"
                />
            </div>
        </motion.div>
    );
};
export default CommitteeCard;