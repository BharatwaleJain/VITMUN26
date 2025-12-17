"use client";
import DelegateTable from "@/components/custom/delegateTableTmp";
import Navbar from "@/pages/navbar";
import { useRouter } from "next/navigation";
import { Lato } from "next/font/google";
const lato = Lato({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-lato",
});
const Page = () => {
    const router = useRouter();
    return (
        <>
            <Navbar />
            <div className="relative pt-[15vh] h-auto max-w-[100vw] overflow-hidden">
                <h1 className={`text-2xl md:text-4xl font-semibold mb-4 text-left  px-6 ${lato.className}`}>
                    Allotments
                </h1>
                <button
                    className="text-white bg-[#FF0040] hover:shadow-lg hover:bg-[#C73C42] shadow-[#FF0040CC] rounded-md py-2 transition-all px-4 mx-6"
                    onClick={() => router.push("/coming-soon")}
                >
                    DELEGATE MATRIX
                </button>
                <div className="pt-8">
                    <DelegateTable />
                </div>
            </div>
        </>
    );
};
export default Page;