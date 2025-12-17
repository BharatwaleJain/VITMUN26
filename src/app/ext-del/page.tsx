"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Lato } from "next/font/google";
const latoBold = Lato({ subsets: ["latin"], weight: "700" });
const latoRegular = Lato({ subsets: ["latin"], weight: "400" });
export default function AddDelegation() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        organisation_name: "",
        head_delegate: "",
        email_id: "",
        contact_number: "",
        delegation_strength: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/api/admin/delegations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert("Delegation added successfully!");
                router.push("/");
            } else {
                alert(result.error || "Failed to add delegation.");
            }
        } catch (error) {
            console.error("Error adding delegation:", error);
            alert("An error occurred while adding the delegation.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0)), url("/back.svg")',
                backgroundRepeat: "repeat",
                backgroundSize: "100% auto",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Image
                        src="/vitmun.svg"
                        alt="VITMUN"
                        width={200}
                        height={60}
                        className="mx-auto my-4"
                    />
                    <p
                        className={`${latoRegular.className} text-gray-600 text-sm border border-gray-400 inline-block px-4 py-1 rounded-full`}
                    >
                        ADD NEW DELEGATION
                    </p>
                </div>
                <Card className="bg-white shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] rounded-lg mb-8">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
                            <div>
                                <Label className={latoBold.className} htmlFor="organisation_name">
                                    Organisation Name *
                                </Label>
                                <Input
                                    id="organisation_name"
                                    name="organisation_name"
                                    value={formData.organisation_name}
                                    onChange={handleChange}
                                    placeholder="Enter organisation name"
                                    required
                                    className="border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                />
                            </div>
                            <div>
                                <Label className={latoBold.className} htmlFor="head_delegate">
                                    Head Delegate *
                                </Label>
                                <Input
                                    id="head_delegate"
                                    name="head_delegate"
                                    value={formData.head_delegate}
                                    onChange={handleChange}
                                    placeholder="Enter head delegate name"
                                    required
                                    className="border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                />
                            </div>
                            <div>
                                <Label className={latoBold.className} htmlFor="email_id">
                                    Email *
                                </Label>
                                <Input
                                    id="email_id"
                                    name="email_id"
                                    type="email"
                                    value={formData.email_id}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                    className="border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                />
                            </div>
                            <div>
                                <Label className={latoBold.className} htmlFor="contact_number">
                                    Contact Number *
                                </Label>
                                <Input
                                    id="contact_number"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    required
                                    className="border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                />
                            </div>
                            <div>
                                <Label className={latoBold.className} htmlFor="delegation_strength">
                                    Delegation Strength *
                                </Label>
                                <Input
                                    id="delegation_strength"
                                    name="delegation_strength"
                                    type="number"
                                    min="1"
                                    value={formData.delegation_strength}
                                    onChange={handleChange}
                                    placeholder="Enter number of delegates"
                                    required
                                    className="border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                />
                            </div>
                            <CardFooter className="flex justify-center pt-4 gap-8 px-0 my-0 py-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-400 text-gray-600 hover:bg-gray-100"
                                    onClick={() => router.push("/admin")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#FF0040] hover:bg-[#C73C42] text-white shadow-md shadow-[#FF004080] my-2"
                                >
                                    {loading ? "Adding..." : "Add Delegation"}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}