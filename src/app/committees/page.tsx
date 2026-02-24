"use client";
import React, { useState } from "react";
import CommitteeCard from "@/components/custom/committee";
import { Lato, Lora } from "next/font/google";
import Navbar from "@/pages/navbar";
import Image from "next/image";
import rawCommittees from "@/data/committtee.json";
const lora = Lora({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-lora",
});
const lato = Lato({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-lato",
});
type BoardPosition =
    | { Chairperson: string; "Vice-Chairperson": string; Director: string }
    | { Chairperson: string; "Vice-Chairperson": string; Directors: string }
    | { "Co-Chairpersons": string; Director: string }
    | { "Co-Chairpersons": string; Scribe: string }
    | { President: string; "Vice-President": string; Director: string };
interface Committee {
    name: string;
    imageWhite: string;
    imageBlack: string;
    date: string;
    agenda: string;
    board: BoardPosition;
}
const committees: Committee[] = rawCommittees as Committee[];
const CommitteesPage = () => {
    const [selectedCommittee, setSelectedCommittee] = useState<{
        date: string; name: string, agenda: string, board: { [key: string]: string }
    } | null>(null);
    const handleCommitteeClick = (committee: { name: string, agenda: string, date: string, board: { [key: string]: string } }) => {
        setSelectedCommittee(committee);
    };
    const closeModal = () => {
        setSelectedCommittee(null);
    };
    return (
        <>
            <Navbar />
            <div className="relative pt-[15vh] h-auto max-w-[100vw] overflow-hidden">
                <h1 className={`text-2xl md:text-4xl font-semibold mb-2 text-left  px-6 ${lato.className}`}>
                    Committees
                </h1>
                <p className="text-md md:text-2xl font-light mb-4 text-left px-6">
                    Presenting the committees for VITMUN'26
                </p>
                <div className={`grid gap-4 md:gap-x-6 lg:gap-x-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 ${lora.className}`}>
                    {committees.map((committee) => (
                        <CommitteeCard
                            key={committee.name}
                            imageWhite={committee.imageWhite}
                            imageBlack={committee.imageBlack}
                            name={committee.name}
                            onClick={() => handleCommitteeClick({
                                name: committee.name,
                                agenda: committee.agenda,
                                date: committee.date,
                                board: committee.board
                            })}
                            isSelected={selectedCommittee?.name === committee.name}
                        />
                    ))}
                </div>
                {selectedCommittee && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="bg-white border-4 border-black p-6 rounded-lg w-2/3 lg:w-1/2 max-w-xl mx-auto text-center relative overflow-y-auto max-h-[90vh] shadow-[0_0_15px_4px_rgba(255,0,64,0.2)]">
                            <button
                                className="absolute top-4 right-4 rounded-full"
                                onClick={closeModal}
                                aria-label="Close Modal"
                            >
                                <Image src="/cross.svg" alt="Close" width={36} height={36} />
                            </button>
                            <h2 className="text-3xl font-bold mb-4">{selectedCommittee.name}</h2>
                            <p className="text-lg mb-2 whitespace-pre-line">
                                <strong>Agenda :</strong> {selectedCommittee.agenda}
                            </p>
                            {selectedCommittee?.date && (
                                <p className="mb-2">
                                    <strong>
                                        {selectedCommittee.name === "SOCHUM" 
                                        ? "Meeting Dated :" 
                                        : "Freeze Date :"}
                                    </strong> {selectedCommittee.date}
                                </p>
                            )}
                            {Object.entries(selectedCommittee.board).map(([position, person]) => (
                                <p key={position} className="mb-2">
                                    <strong>{position} :</strong> {person}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default CommitteesPage;