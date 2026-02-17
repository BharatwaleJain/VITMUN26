"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
const DelegateTable = () => {
    const [activeTab, setActiveTab] = useState<string>("UNGA");
    const [isMobileView, setIsMobileView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const tabs = [
        { title: "UNGA", value: "UNGA" },
        { title: "SOCHUM", value: "SOCHUM" },
        { title: "UNSC", value: "UNSC" },
        { title: "PEC-YALTA", value: "PEC-YALTA" },
        { title: "CHAOS", value: "CHAOS" },
        { title: "AIPPM", value: "AIPPM" },
    ];
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 960);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [activeTab]);
    return (
        <div className="w-full">
            {isMobileView ? (
                <div className="relative">
                    <button
                        className="p-4 w-full flex justify-between items-center shadow-md"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="font-medium text-gray-700">{activeTab}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transform transition-transform ${menuOpen ? "rotate-180" : "rotate-0"
                                }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06-.02L10 10.17l3.71-3.98a.75.75 0 111.08 1.04l-4 4.28a.75.75 0 01-1.08 0l-4-4.28a.75.75 0 01-.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bg-white shadow-md w-full mt-2 rounded-lg z-10"
                            >
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => {
                                            setActiveTab(tab.value);
                                            setMenuOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 ${activeTab === tab.value
                                            ? "bg-[#FF0040] text-white font-semibold"
                                            : "hover:bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {tab.title}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex justify-center items-center space-x-4 p-4 rounded-lg">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium ${activeTab === tab.value
                                ? "bg-[#FF0040] text-white"
                                : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {tab.title}
                        </motion.button>
                    ))}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Table className="mt-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sr No.</TableHead>
                            <TableHead>Portfolio</TableHead>
                            <TableHead>Delegate Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>TBD</TableCell>
                            <TableCell>TBD</TableCell>
                            <TableCell>Data will be Updated Soon</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    );
};
export default DelegateTable;
