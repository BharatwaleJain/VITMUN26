"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import NeedHelp from "@/components/custom/needHelp";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Lora } from "next/font/google";
import { Lato } from "next/font/google";
import Navbar from "@/pages/navbar";
const latoThin = Lato({ subsets: ["latin"], weight: "300" });
const latoBold = Lato({ subsets: ["latin"], weight: "700" });
const lora = Lora({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-lora",
});
const ExternalDelegateForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        participant_name: "",
        gender: "",
        contact_number: "",
        email_id: "",
        organisation_name: "",
        accommodation: "",
        committee_preference_1: "",
        allotment_preference_1_1: "",
        allotment_preference_1_2: "",
        allotment_preference_1_3: "",
        committee_preference_2: "",
        allotment_preference_2_1: "",
        allotment_preference_2_2: "",
        allotment_preference_2_3: "",
        committee_preference_3: "",
        allotment_preference_3_1: "",
        allotment_preference_3_2: "",
        allotment_preference_3_3: "",
        exp_delegate_muns: "",
        exp_delegate_text: "",
        exp_eb_muns: "",
        exp_eb_text: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const { toast } = useToast();
    const isRegistrationOpen = false;
    const router = useRouter();
    const validateForm = () => {
        const requiredFields = [
            "participant_name",
            "gender",
            "contact_number",
            "email_id",
            "organisation_name",
            "accommodation",
            "committee_preference_1",
            "committee_preference_2",
            "committee_preference_3",
        ];
        let isValid = true
        const updatedFormData = { ...formData };
        requiredFields.forEach((field) => {
            if (!formData[field] || formData[field].trim() === "") {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `${field.replace(/_/g, " ")} is required.`,
                });
                updatedFormData[field] = "";
                isValid = false;
            }
        });
        if (formData.email_id && !/\S+@\S+\.\S+/.test(formData.email_id)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid Email ID.",
            });
            updatedFormData.email_id = "";
            isValid = false;
        }
        if (formData.contact_number && !/^\d{10}$/.test(formData.contact_number)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Contact Number must be exactly 10 digits.",
            });
            updatedFormData.contact_number = "";
            isValid = false;
        }
        if (formData.exp_delegate_muns && Number(formData.exp_delegate_muns) < 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "MUN experience cannot be negative.",
            });
            updatedFormData.exp_delegate_muns = "";
            isValid = false;
        }
        if (formData.exp_eb_muns && Number(formData.exp_eb_muns) < 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "EB experience cannot be negative.",
            });
            updatedFormData.exp_eb_muns = "";
            isValid = false;
        }
        const committeePreferences = [
            formData.committee_preference_1,
            formData.committee_preference_2,
            formData.committee_preference_3,
        ];
        if (new Set(committeePreferences).size !== committeePreferences.length) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Committee Preferences must be unique.",
            });
            isValid = false;
        }
        const allotmentGroups = [
            [
                formData.allotment_preference_1_1,
                formData.allotment_preference_1_2,
                formData.allotment_preference_1_3,
            ],
            [
                formData.allotment_preference_2_1,
                formData.allotment_preference_2_2,
                formData.allotment_preference_2_3,
            ],
            [
                formData.allotment_preference_3_1,
                formData.allotment_preference_3_2,
                formData.allotment_preference_3_3,
            ],
        ];
        allotmentGroups.forEach((group, index) => {
            if (new Set(group).size !== group.length) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Allotment preferences within Committee Preference ${index + 1
                        } must be unique.`,
                });
                isValid = false;
            }
        });
        setFormData(updatedFormData);
        return isValid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        setIsSubmitting(true);
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        try {
            const response = await fetch("/api/submit-delegate-form-ext", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                toast({
                    variant: "success",
                    title: "Form Submitted Successfully",
                    description: "Redirecting you to the home page...",
                });
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } else {
                if (response.status === 400) {
                    toast({
                        variant: "destructive",
                        title: "Duplicate Entry Detected",
                        description:
                            "An entry with this email/contact already exists. Please contact Delegate Affairs for support.",
                    });
                } else if (response.status === 500) {
                    toast({
                        variant: "destructive",
                        title: "Server Error",
                        description: "Something went wrong on our end. Try again later.",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Unexpected Error",
                        description: data.error || "Please check your input and try again.",
                    });
                }
                setIsSubmitting(false);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Network Error",
                description:
                    "An error occurred while submitting the form. Please try again.",
            });
            console.error("Error:", error);
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <Navbar />
            <div className="px-4 sm:px-8 lg:px-20 pt-[7vh] overflow-auto scroll-smooth">
                <h1 className={`${latoBold.className} text-2xl md:text-3xl mb-2 text-leftb mt-8`}>
                    External Individual Registration Form
                </h1>
                <p className={`${latoThin.className} text-md md:text-lg mb-8`}>
                    Fill out the form below if you are interested in participating at
                    VITMUN&apos;26.
                </p>
                {!isRegistrationOpen && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 text-center">
                        Thank you for your interest. External individual registrations are no longer being accepted.
                    </div>
                )}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 bg-white shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] rounded-lg p-6 md:p-10"
                >
                    {/* Personal Information */}
                    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="participant_name"
                            >
                                Participant Name
                            </label>
                            <input
                                type="text"
                                name="participant_name"
                                value={formData.participant_name}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="gender"
                            >
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="contact_number"
                            >
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="WhatsApp Number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="email_id"
                            >
                                Email ID
                            </label>
                            <input
                                type="email"
                                name="email_id"
                                value={formData.email_id}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Email ID"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="organisation_name"
                            >
                                Organisation Name
                            </label>
                            <input
                                type="text"
                                name="organisation_name"
                                value={formData.organisation_name}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Organisation"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className={`block font-medium mb-1 ${lora.className}`}
                                htmlFor="accommodation"
                            >
                                Accommodation
                            </label>
                            <select
                                name="accommodation"
                                value={formData.accommodation}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]  text-black"
                                required
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                    {/* Committee Preferences */}
                    <fieldset>
                        <div className="flex items-center mb-2">
                            <legend className="text-2xl md:text-3xl font-extrabold">
                                Delegate Preference
                            </legend>
                            <Button
                                variant="del_matrix"
                                type="button"
                                size="xsm"
                                className="ml-4 mt-[0.33rem]"
                                onClick={() => window.open("/allotments", "_blank")}
                            >
                                DELEGATE MATRIX
                            </Button>
                        </div>
                        <p className="text-lg md:text-xl mb-1 font-bold">
                            Registration fee per delegate is Rs. 2100 (inclusive of GST). Payment link will be mailed once allotment is confirmed.
                            <br />
                            If you are an External School Delegate, the fee is Rs. 1600 (inclusive of GST).
                        </p>
                        {[1, 2, 3].map((pref) => (
                            <div
                                key={pref}
                                className="mt-6 p-4 border-2 border-black rounded-lg shadow-sm"
                            >
                                <label className="block font-medium mb-2">
                                    Committee Preference {pref}
                                </label>
                                <select
                                    name={`committee_preference_${pref}`}
                                    value={formData[`committee_preference_${pref}`]}
                                    disabled={!isRegistrationOpen}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 mb-4 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                    required
                                >
                                    <option value="" disabled>
                                        Select Committee
                                    </option>
                                    <option value="UNGA">UNGA</option>
                                    <option value="SOCHUM">SOCHUM</option>
                                    <option value="UNSC">UNSC</option>
                                    <option value="PEC-YALTA">PEC-YALTA</option>
                                    <option value="CHAOS">CHAOS</option>
                                    <option value="JPC">JPC</option>
                                </select>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((allotment) => (
                                        <input
                                            key={allotment}
                                            type="text"
                                            name={`allotment_preference_${pref}_${allotment}`}
                                            value={
                                                formData[`allotment_preference_${pref}_${allotment}`]
                                            }
                                            disabled={!isRegistrationOpen}
                                            onChange={handleChange}
                                            placeholder={`Allotment Preference ${allotment}`}
                                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                            required
                                        />
                                    ))}
                                </div>
                                <p className="font-bold text-sm md:text-md text-center py-2 md:py-4">
                                    *Please Refer Delegate Matrix Above
                                </p>
                            </div>
                        ))}
                    </fieldset>
                    {/* Experience Section */}
                    <fieldset>
                        <legend className="text-lg font-semibold mb-4">Experience</legend>
                        <div className="space-y-4">
                            <input
                                type="number"
                                name="exp_delegate_muns"
                                value={formData.exp_delegate_muns}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Number of MUNs as Delegate"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                required
                                min="0"
                            />
                            <textarea
                                name="exp_delegate_text"
                                value={formData.exp_delegate_text}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Conference Name/year - Committee - Country - Award(N/A if none)"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                rows={3}
                                required
                            ></textarea>
                            <input
                                type="number"
                                name="exp_eb_muns"
                                value={formData.exp_eb_muns}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Number of MUNs as Executive Board"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                required
                                min="0"
                            />
                            <textarea
                                name="exp_eb_text"
                                value={formData.exp_eb_text}
                                disabled={!isRegistrationOpen}
                                onChange={handleChange}
                                placeholder="Conference Name/year - Committee - Country - Award(N/A if none)"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF0040]"
                                rows={3}
                                required
                            ></textarea>
                        </div>
                    </fieldset>
                    {/* Submit Button */}
                    <div className="text-center">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isRegistrationOpen}
                            className={`bg-[#FF0040] hover:bg-[#C73C42] text-white font-semibold py-2 px-6 rounded-lg transition uppercase text-md md:text-lg shadow-md shadow-[#FF0040] ${isSubmitting || !isRegistrationOpen ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? "Submitting..." : "PRESENT AND VOTING"}
                        </Button>
                    </div>
                </form>
                <NeedHelp />
            </div>
        </>
    );
};
export default ExternalDelegateForm;