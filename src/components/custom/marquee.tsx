import React, { FC } from 'react';
import Image from 'next/image';
interface MarqueeProps {
    text1: string;
    text2: string;
}
const Marquee: FC<MarqueeProps> = ({ text1, text2 }) => {
    return (
        <div className="overflow-hidden w-full text-white font-bebas text-[2vh] lg:text-[3vh] py-1 z-1">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(8)].map((_, index) => (
                    <React.Fragment key={index}>
                        <Image src="/trident.svg" width={36} height={36} alt="trident" />
                        <div className="inline-block mx-6">{text1}</div>
                        <div className="inline-block mr-6">{text2}</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
export default Marquee;
