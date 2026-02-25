"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lato } from "next/font/google";
import { Menu, X, Download, LogOut, RefreshCw, Users, Building2, UserCheck } from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
const latoBold = Lato({ subsets: ["latin"], weight: "700" });
const latoRegular = Lato({ subsets: ["latin"], weight: "400" });
interface Delegate {
    _id: string;
    participant_name?: string;
    gender?: string;
    contact_number?: string;
    email_id?: string;
    organisation_name?: string;
    accommodation?: string;
    allotment_committee?: string;
    allotment_portfolio?: string;
    paid: boolean;
    lunch: boolean;
    registration_number?: string;
    committee_preferences?: string[] | {
        preference_1?: {
            committee: string;
            allotments: [string, string, string];
        };
        preference_2?: {
            committee: string;
            allotments: [string, string, string];
        };
        preference_3?: {
            committee: string;
            allotments: [string, string, string];
        };
    };
    experience?: string | {
        delegate: {
            muns: string;
            experience: string;
        };
        eb: {
            muns: string;
            experience: string;
        };
    };
}
interface Delegation {
    _id: string;
    organisation_name?: string;
    organisationName?: string;
    head_delegate?: string;
    headDelegate?: string;
    email_id?: string;
    email?: string;
    contact_number?: string;
    contactNumber?: string;
    delegation_strength?: number;
    delegationStrength?: number;
}
const AdminPage = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [externalDelegates, setExternalDelegates] = useState<Delegate[]>([]);
    const [internalDelegates, setInternalDelegates] = useState<Delegate[]>([]);
    const [delegations, setDelegations] = useState<Delegation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUnallottedOnly, setShowUnallottedOnly] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"internal" | "external" | "delegations">("internal");
    const [editingDelegateId, setEditingDelegateId] = useState<string | null>(null);
    const [selectedCommitteeForEdit, setSelectedCommitteeForEdit] = useState<string>("");
    const [showCustomPortfolio, setShowCustomPortfolio] = useState(false);
    const [customPortfolioValue, setCustomPortfolioValue] = useState("");
    const ALL_COMMITTEES = ["UNGA", "SOCHUM", "UNSC", "PEC-YALTA", "CHAOS", "JPC"];
    const getCommitteesFromPreferences = (delegate: Delegate): string[] => {
        const prefs = delegate.committee_preferences;
        if (!prefs || Array.isArray(prefs)) {
            return ALL_COMMITTEES;
        }
        const committees: string[] = [];
        if (prefs.preference_1?.committee)
            committees.push(prefs.preference_1.committee);
        if (prefs.preference_2?.committee)
            committees.push(prefs.preference_2.committee);
        if (prefs.preference_3?.committee)
            committees.push(prefs.preference_3.committee);
        return committees.length > 0 ? committees : ALL_COMMITTEES;
    };
    const getPortfoliosForCommittee = (delegate: Delegate, committee: string): string[] => {
        const prefs = delegate.committee_preferences;
        if (!prefs || Array.isArray(prefs)) {
            return [];
        }
        if (prefs.preference_1?.committee === committee && prefs.preference_1?.allotments) {
            return prefs.preference_1.allotments.filter(a => a && a.trim() !== "");
        }
        if (prefs.preference_2?.committee === committee && prefs.preference_2?.allotments) {
            return prefs.preference_2.allotments.filter(a => a && a.trim() !== "");
        }
        if (prefs.preference_3?.committee === committee && prefs.preference_3?.allotments) {
            return prefs.preference_3.allotments.filter(a => a && a.trim() !== "");
        }
        return [];
    };
    const openEditSheet = (delegate: Delegate) => {
        setEditingDelegateId(delegate._id);
        setSelectedCommitteeForEdit(delegate.allotment_committee || "");
        setShowCustomPortfolio(false);
        setCustomPortfolioValue("");
    };
    const handleCommitteeSelectChange = (delegateId: string, committee: string, type: "internal" | "external") => {
        setSelectedCommitteeForEdit(committee);
        setShowCustomPortfolio(false);
        setCustomPortfolioValue("");
        if (type === "internal") {
            handleInternalChange(delegateId, "allotment_committee", committee);
            handleInternalChange(delegateId, "allotment_portfolio", "");
        } else {
            handleExternalChange(delegateId, "allotment_committee", committee);
            handleExternalChange(delegateId, "allotment_portfolio", "");
        }
    };
    const handlePortfolioSelectChange = (delegateId: string, portfolio: string, type: "internal" | "external") => {
        if (portfolio === "__other__") {
            setShowCustomPortfolio(true);
            return;
        }
        setShowCustomPortfolio(false);
        if (type === "internal") {
            handleInternalChange(delegateId, "allotment_portfolio", portfolio);
        } else {
            handleExternalChange(delegateId, "allotment_portfolio", portfolio);
        }
    };
    const handleCustomPortfolioChange = (delegateId: string, value: string, type: "internal" | "external") => {
        setCustomPortfolioValue(value);
        if (type === "internal") {
            handleInternalChange(delegateId, "allotment_portfolio", value);
        } else {
            handleExternalChange(delegateId, "allotment_portfolio", value);
        }
    };
    const updateAllLunchStatus = async () => {
        if (!confirm("Are you sure you want to reset the lunch status for all delegates?")) {
            return;
        }
        try {
            const response = await fetch("/api/admin/update-lunch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (data.success) {
                alert(`Successfully reset lunch status for delegates!`);
                window.location.reload();
            } else {
                alert("Failed to update lunch status.");
            }
        } catch (error) {
            console.error("Error updating lunch status:", error);
            alert("An error occurred while updating lunch status.");
        }
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem("isAdminLoggedIn", "true");
                setIsAuthenticated(true);
                setUsername("");
                setPassword("");
                await fetchData();
            } else {
                setLoginError(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError("An error occurred during login");
        }
    };
    const handleLogout = () => {
        sessionStorage.removeItem("isAdminLoggedIn");
        setIsAuthenticated(false);
        setExternalDelegates([]);
        setInternalDelegates([]);
        setDelegations([]);
    };
    const fetchData = async () => {
        try {
            const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
            if (!isLoggedIn) {
                setIsAuthenticated(false);
                return;
            }
            const [externalResponse, internalResponse, delegationResponse] =
                await Promise.all([
                    fetch("/api/admin/delegates?type=external"),
                    fetch("/api/admin/delegates?type=internal"),
                    fetch("/api/admin/delegations"),
                ]);
            if (
                externalResponse.status === 401 ||
                internalResponse.status === 401 ||
                delegationResponse.status === 401
            ) {
                handleLogout();
                return;
            }
            const externalData = await externalResponse.json();
            const internalData = await internalResponse.json();
            const delegationData = await delegationResponse.json();
            if (!externalData.success || !internalData.success || !delegationData.success) {
                console.error("API Error:", {
                    external: externalData.error,
                    internal: internalData.error,
                    delegation: delegationData.error,
                });
                alert("Failed to fetch data. Check console for details.");
                return;
            }
            setExternalDelegates(externalData.data || []);
            setInternalDelegates(internalData.data || []);
            setDelegations(delegationData.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error instanceof Error && error.message.includes("unauthorized")) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };
    const handleInternalChange = (id: string, field: string, value: string | boolean) => {
        setInternalDelegates((prev) =>
            prev.map((delegate) =>
                delegate._id === id ? { ...delegate, [field]: value } : delegate
            )
        );
    };
    const handleExternalChange = (id: string, field: string, value: string | boolean) => {
        setExternalDelegates((prev) =>
            prev.map((delegate) =>
                delegate._id === id ? { ...delegate, [field]: value } : delegate
            )
        );
    };
    const updateDelegate = async (
        type: "external" | "internal",
        _id: string,
        name: string,
        committee: string | undefined,
        portfolio: string | undefined,
        paid: boolean,
        lunch: boolean
    ) => {
        void _id;
        try {
            const response = await fetch(`/api/admin/delegates`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type,
                    name,
                    allotment_committee: committee,
                    allotment_portfolio: portfolio,
                    paid,
                    lunch,
                }),
            });
            const result = await response.json();
            if (result.data?.modified !== undefined) {
                alert("Updated successfully!");
                fetchData();
            } else {
                alert(result.error || "Failed to update.");
            }
        } catch (error) {
            console.error("Error updating delegate:", error);
            alert("An error occurred.");
        }
    };
    const filterDelegates = (delegates: Delegate[]) => {
        let filtered = delegates;
        if (showUnallottedOnly) {
            filtered = filtered.filter(
                (delegate) =>
                    !delegate.allotment_committee || !delegate.allotment_portfolio
            );
        }
        if (paymentFilter === "paid") {
            filtered = filtered.filter((delegate) => delegate.paid === true);
        } else if (paymentFilter === "unpaid") {
            filtered = filtered.filter((delegate) => delegate.paid === false || !delegate.paid);
        }
        return filtered;
    };
    const generateExcel = async () => {
        const ExcelJS = (await import("exceljs")).default;
        const { saveAs } = await import("file-saver");
        const workbook = new ExcelJS.Workbook();
        const sheets = {
            internal: internalDelegates,
            external: externalDelegates,
            delegations: delegations,
        };
        const data = {
            internal: internalDelegates,
            external: externalDelegates,
            delegations: delegations,
        };
        for (const [sheetName, sheetData] of Object.entries(sheets)) {
            if (!sheetData.length)
                continue;
            const worksheet = workbook.addWorksheet(sheetName);
            const formattedData = sheetData.map((entry: any) => {
                const newEntry = { ...entry };
                delete newEntry._id;
                delete newEntry.committee_preferences;
                delete newEntry.experience;
                if (entry.committee_preferences && typeof entry.committee_preferences === "object") {
                    for (let i = 1; i <= 3; i++) {
                        const pref = entry.committee_preferences[`preference_${i}`];
                        newEntry[`Committee ${i}`] = pref?.committee || "";
                        newEntry[`Preference ${i}`] = pref?.allotments?.join(", ") || "";
                    }
                }
                if (entry.experience && typeof entry.experience === "object") {
                    newEntry["Delegate MUNs"] = entry.experience.delegate?.muns || "";
                    newEntry["Delegate Experience"] = entry.experience.delegate?.experience || "";
                    newEntry["EB MUNs"] = entry.experience.eb?.muns || "";
                    newEntry["EB Experience"] = entry.experience.eb?.experience || "";
                }
                return newEntry;
            });
            worksheet.columns = Object.keys(formattedData[0]).map(key => ({
                header: key,
                key,
                width: 20,
            }));
            worksheet.addRows(formattedData);
        }
        const buffer = await workbook.xlsx.writeBuffer();
        const timestamp = new Date()
            .toISOString()
            .replace("T", "_")
            .substring(0, 16)
            .replaceAll(":", "-");
        saveAs(new Blob([buffer]), `vitmundata_${timestamp}.xlsx`);
    };
    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
            if (isLoggedIn === "true") {
                setIsAuthenticated(true);
                await fetchData();
            }
            setLoading(false);
        };
        checkAuth();
    }, []);
    const totalInternal = internalDelegates.length;
    const totalExternal = externalDelegates.length;
    const totalDelegations = delegations.length;
    const paidInternal = internalDelegates.filter(d => d.paid).length;
    const paidExternal = externalDelegates.filter(d => d.paid).length;
    const allottedInternal = internalDelegates.filter(d => d.allotment_committee).length;
    const allottedExternal = externalDelegates.filter(d => d.allotment_committee).length;
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0040]"></div>
                    <p className={`${latoRegular.className} text-gray-600`}>Loading...</p>
                </div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)), url("/back.png")', backgroundRepeat: 'repeat', backgroundSize: '100% auto', backgroundAttachment: 'fixed', backgroundPosition: 'top center' }}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Image
                            src="/vitmun.svg"
                            alt="VITMUN"
                            width={200}
                            height={60}
                            className="mx-auto mb-4"
                        />
                        <p className={`${latoRegular.className} text-gray-600 text-sm border border-gray-400 inline-block px-4 py-1 rounded-full`}>
                            ADMIN PANEL
                        </p>
                    </div>
                    <div className="bg-white shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] rounded-lg p-8">
                        <h2 className={`${latoBold.className} text-2xl text-center mb-2`}>Welcome Back</h2>
                        <p className={`${latoRegular.className} text-gray-500 text-center mb-6`}>
                            Enter your credentials to continue
                        </p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className={latoBold.className}>Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className={latoBold.className}>Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border-gray-300 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                    placeholder="Enter password"
                                />
                            </div>
                            {loginError && (
                                <div className="p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
                                    {loginError}
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-[#FF0040] hover:bg-[#C73C42] text-white font-semibold py-2 rounded-lg transition shadow-md shadow-[#FF004080]"
                            >
                                Login
                            </Button>
                        </form>
                    </div>
                    <p className={`${latoRegular.className} text-center text-gray-500 text-sm mt-6`}>
                        <Link href="/" className="text-[#FF0040] hover:underline">Back to Home</Link>
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)), url("/back.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '100% auto',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'top center'
            }}
        >
            <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm shadow-md z-50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {/* Desktop Navigation */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <Image src="/vitmun.svg" alt="VITMUN" width={120} height={40} />
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab("internal")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "internal"
                                        ? "bg-[#FF0040] text-white"
                                        : "text-gray-600 hover:text-[#FF0040]"
                                        }`}
                                >
                                    Internal
                                </button>
                                <button
                                    onClick={() => setActiveTab("external")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "external"
                                        ? "bg-[#FF0040] text-white"
                                        : "text-gray-600 hover:text-[#FF0040]"
                                        }`}
                                >
                                    External
                                </button>
                                <button
                                    onClick={() => setActiveTab("delegations")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === "delegations"
                                        ? "bg-[#FF0040] text-white"
                                        : "text-gray-600 hover:text-[#FF0040]"
                                        }`}
                                >
                                    Delegations
                                </button>
                            </div>
                            <div
                                className={`flex items-center gap-2 ml-4 px-3 py-1 rounded-lg ${activeTab === "delegations" ? "invisible" : "bg-gray-50"
                                    }`}
                            >
                                <Switch
                                    id="showUnallotted"
                                    checked={showUnallottedOnly}
                                    onCheckedChange={setShowUnallottedOnly}
                                />
                                <label htmlFor="showUnallotted" className="text-sm text-gray-600">
                                    Unallotted Only
                                </label>
                            </div>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")}
                                className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:ring-[#FF0040] focus:border-[#FF0040]"
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid Only</option>
                                <option value="unpaid">Unpaid Only</option>
                            </select>
                            <Link href="/allotments" className="text-sm text-gray-600 hover:text-[#FF0040]">
                                Allotments
                            </Link>
                            <Button
                                onClick={generateExcel}
                                variant="outline"
                                size="sm"
                                className="border-[#FF0040] text-[#FF0040] hover:bg-[#FF0040] hover:text-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Excel
                            </Button>
                            <Button
                                onClick={updateAllLunchStatus}
                                variant="outline"
                                size="sm"
                                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Lunch
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="border-gray-400 text-gray-600 hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden pt-4 pb-2 border-t mt-3">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => { setActiveTab("internal"); setIsMenuOpen(false); }}
                                    className={`px-4 py-2 rounded-md text-left ${activeTab === "internal" ? "bg-[#FF0040] text-white" : "text-gray-600"}`}
                                >
                                    Internal Delegates
                                </button>
                                <button
                                    onClick={() => { setActiveTab("external"); setIsMenuOpen(false); }}
                                    className={`px-4 py-2 rounded-md text-left ${activeTab === "external" ? "bg-[#FF0040] text-white" : "text-gray-600"}`}
                                >
                                    External Delegates
                                </button>
                                <button
                                    onClick={() => { setActiveTab("delegations"); setIsMenuOpen(false); }}
                                    className={`px-4 py-2 rounded-md text-left ${activeTab === "delegations" ? "bg-[#FF0040] text-white" : "text-gray-600"}`}
                                >
                                    Delegations
                                </button>
                                {activeTab === "delegations" ? null : (
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        <Switch
                                            id="showUnallottedMobile"
                                            checked={showUnallottedOnly}
                                            onCheckedChange={setShowUnallottedOnly}
                                        />
                                        <label htmlFor="showUnallottedMobile" className="text-sm text-gray-600">
                                            Show unallotted only
                                        </label>
                                    </div>
                                )}
                                <div className="px-4 py-2">
                                    <label className="text-sm text-gray-600 block mb-1">Payment Status</label>
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")}
                                        className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="paid">Paid Only</option>
                                        <option value="unpaid">Unpaid Only</option>
                                    </select>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2 border-t">
                                    <Button onClick={generateExcel} size="sm" className="bg-[#FF0040] text-white">
                                        <Download className="w-4 h-4 mr-2" /> Excel
                                    </Button>
                                    <Button onClick={updateAllLunchStatus} size="sm" variant="outline" className="border-orange-500 text-orange-500">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Reset Lunch
                                    </Button>
                                    <Button onClick={handleLogout} size="sm" variant="outline">
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <div className="pt-24 px-4 md:px-8 lg:px-16 pb-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.15)] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className={`${latoRegular.className} text-gray-500 text-sm`}>Internal</p>
                                <p className={`${latoBold.className} text-2xl`}>{totalInternal}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{allottedInternal} allotted | {paidInternal} paid</p>
                    </div>
                    <div className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.15)] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className={`${latoRegular.className} text-gray-500 text-sm`}>External</p>
                                <p className={`${latoBold.className} text-2xl`}>{totalExternal}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{allottedExternal} allotted | {paidExternal} paid</p>
                    </div>
                    <div className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.15)] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className={`${latoRegular.className} text-gray-500 text-sm`}>Delegations</p>
                                <p className={`${latoBold.className} text-2xl`}>{totalDelegations}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.15)] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#FF0040]/10 rounded-lg">
                                <Users className="w-5 h-5 text-[#FF0040]" />
                            </div>
                            <div>
                                <p className={`${latoRegular.className} text-gray-500 text-sm`}>Total</p>
                                <p className={`${latoBold.className} text-2xl`}>{totalInternal + totalExternal}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{paidInternal + paidExternal} paid total</p>
                    </div>
                </div>
                {/* Info Banner */}
                <div className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.1)] rounded-lg p-4 mb-8">
                    <p className={`${latoRegular.className} text-gray-600 text-sm`}>
                        <span className="font-bold">Tip:</span> Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+F</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd+F</kbd> to search.
                        <span className="text-[#FF0040] font-bold ml-2">Don&apos;t forget to save changes!</span>
                    </p>
                </div>
                {/* Tab Content */}
                {activeTab === "internal" && (
                    <section>
                        <h2 className={`${latoBold.className} text-2xl md:text-3xl mb-6`}>
                            Internal Delegates
                            <span className="text-gray-400 text-lg ml-2">({filterDelegates(internalDelegates).length})</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterDelegates(internalDelegates).map((internal) => (
                                <Card key={internal._id} className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.1)] border-0 hover:shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className={`${latoBold.className} text-lg`}>
                                                    {internal.participant_name || "Name not provided"}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">{internal.registration_number || "No Reg. No."}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${internal.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-[#FF0040]"}`}>
                                                {internal.paid ? "Paid" : "Unpaid"}
                                            </span>
                                        </div>
                                        <CardDescription className="mt-2">
                                            <span className={`inline-block px-2 py-1 rounded text-sm ${internal.allotment_committee ? "bg-[#FF0040]/10 text-[#FF0040] font-medium" : "bg-gray-100 text-gray-500"}`}>
                                                {internal.allotment_committee || "Not Allotted"}
                                            </span>
                                            {internal.allotment_portfolio && (
                                                <span className="text-gray-600 text-sm ml-2">| {internal.allotment_portfolio}</span>
                                            )}
                                            <span className={`inline-block ml-2 px-2 py-1 rounded text-sm ${internal.lunch ? "bg-green-100 text-green-600 font-medium" : "bg-gray-100 text-gray-500"}`}>
                                                {internal.lunch ? "Lunch" : "No Lunch"}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="personalDetails" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Contact Details</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-1 text-sm">
                                                        <p><span className="text-gray-500">Email:</span> {internal.email_id || "N/A"}</p>
                                                        <p><span className="text-gray-500">Phone:</span> {internal.contact_number || "N/A"}</p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="preferences" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Preferences</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                                        {Array.isArray(internal.committee_preferences) ? (
                                                            internal.committee_preferences.map((pref, idx) => (
                                                                <p key={idx}>{idx + 1}. {pref}</p>
                                                            ))
                                                        ) : (
                                                            Object.entries(internal.committee_preferences || {}).map(
                                                                ([key, val], idx) => (
                                                                    <div key={key} className="bg-gray-50 p-2 rounded">
                                                                        <p className="font-medium">{idx + 1}. {val?.committee || "N/A"}</p>
                                                                        <p className="text-gray-500 text-xs">{val?.allotments?.join(", ") || "No preferences"}</p>
                                                                    </div>
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="experience" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Experience</AccordionTrigger>
                                                <AccordionContent>
                                                    {typeof internal.experience === 'string' ? (
                                                        <p className="text-sm">{internal.experience}</p>
                                                    ) : (
                                                        <div className="space-y-2 text-sm">
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <p className="font-medium">As Delegate: {internal.experience?.delegate?.muns || 0} MUNs</p>
                                                                <p className="text-gray-500 text-xs">{internal.experience?.delegate?.experience || "N/A"}</p>
                                                            </div>
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <p className="font-medium">As EB: {internal.experience?.eb?.muns || 0} MUNs</p>
                                                                <p className="text-gray-500 text-xs">{internal.experience?.eb?.experience || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Sheet onOpenChange={(open) => open && openEditSheet(internal)}>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full border-[#FF0040] text-[#FF0040] hover:bg-[#FF0040] hover:text-white">
                                                    Edit Allotment
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Edit Allotment</SheetTitle>
                                                    <SheetDescription>
                                                        Update allotment for {internal.participant_name}
                                                    </SheetDescription>
                                                </SheetHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Committee</Label>
                                                        <select
                                                            value={editingDelegateId === internal._id ? selectedCommitteeForEdit : (internal.allotment_committee || "")}
                                                            onChange={(e) => handleCommitteeSelectChange(internal._id, e.target.value, "internal")}
                                                            className="w-full border rounded-md px-3 py-2 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                                        >
                                                            <option value="" disabled>Select Committee</option>
                                                            {getCommitteesFromPreferences(internal).map((committee) => (
                                                                <option key={committee} value={committee}>{committee}</option>
                                                            ))}
                                                            <option value="__other__" className="text-gray-500">-- Other (Custom) --</option>
                                                        </select>
                                                        {selectedCommitteeForEdit === "__other__" && editingDelegateId === internal._id && (
                                                            <Input
                                                                placeholder="Enter custom committee"
                                                                className="mt-2"
                                                                onChange={(e) => handleInternalChange(internal._id, "allotment_committee", e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Portfolio</Label>
                                                        {(() => {
                                                            const currentCommittee = editingDelegateId === internal._id ? selectedCommitteeForEdit : (internal.allotment_committee || "");
                                                            const portfolios = getPortfoliosForCommittee(internal, currentCommittee);
                                                            const hasPortfolioOptions = portfolios.length > 0 && currentCommittee !== "__other__";
                                                            if (!hasPortfolioOptions || showCustomPortfolio) {
                                                                return (
                                                                    <Input
                                                                        value={editingDelegateId === internal._id && showCustomPortfolio ? customPortfolioValue : (internal.allotment_portfolio || "")}
                                                                        onChange={(e) => handleCustomPortfolioChange(internal._id, e.target.value, "internal")}
                                                                        placeholder="Enter portfolio"
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <>
                                                                    <select
                                                                        value={internal.allotment_portfolio || ""}
                                                                        onChange={(e) => handlePortfolioSelectChange(internal._id, e.target.value, "internal")}
                                                                        className="w-full border rounded-md px-3 py-2 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                                                    >
                                                                        <option value="" disabled>Select Portfolio</option>
                                                                        {portfolios.map((portfolio) => (
                                                                            <option key={portfolio} value={portfolio}>{portfolio}</option>
                                                                        ))}
                                                                        <option value="__other__" className="text-gray-500">-- Other (Custom) --</option>
                                                                    </select>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Payment Status</Label>
                                                        <select
                                                            defaultValue={internal.paid?.toString() || "false"}
                                                            onChange={(e) => handleInternalChange(internal._id, "paid", e.target.value === "true")}
                                                            className="w-full border rounded-md px-3 py-2"
                                                        >
                                                            <option value="true">Paid</option>
                                                            <option value="false">Unpaid</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lunch Status</Label>
                                                        <select
                                                            defaultValue={internal.lunch?.toString() || "false"}
                                                            onChange={(e) => handleInternalChange(internal._id, "lunch", e.target.value === "true")}
                                                            className="w-full border rounded-md px-3 py-2"
                                                        >
                                                            <option value="true">Lunch</option>
                                                            <option value="false">No Lunch</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                        <Button
                                                            onClick={() => updateDelegate("internal", internal._id, internal.participant_name || "", internal.allotment_committee, internal.allotment_portfolio, internal.paid, internal.lunch)}
                                                            className="bg-[#FF0040] hover:bg-[#C73C42] text-white"
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
                {activeTab === "external" && (
                    <section>
                        <h2 className={`${latoBold.className} text-2xl md:text-3xl mb-6`}>
                            External Delegates
                            <span className="text-gray-400 text-lg ml-2">({filterDelegates(externalDelegates).length})</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterDelegates(externalDelegates).map((external) => (
                                <Card key={external._id} className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.1)] border-0 hover:shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className={`${latoBold.className} text-lg`}>
                                                    {external.participant_name || "Name not provided"}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">{external.organisation_name || "No Organisation"}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${external.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-[#FF0040]"}`}>
                                                {external.paid ? "Paid" : "Unpaid"}
                                            </span>
                                        </div>
                                        <CardDescription className="mt-2">
                                            <span className={`inline-block px-2 py-1 rounded text-sm ${external.allotment_committee ? "bg-[#FF0040]/10 text-[#FF0040] font-medium" : "bg-gray-100 text-gray-500"}`}>
                                                {external.allotment_committee || "Not Allotted"}
                                            </span>
                                            {external.allotment_portfolio && (
                                                <span className="text-gray-600 text-sm ml-2">| {external.allotment_portfolio}</span>
                                            )}
                                            <span className={`inline-block ml-2 px-2 py-1 rounded text-sm ${external.lunch ? "bg-green-100 text-green-600 font-medium" : "bg-gray-100 text-gray-500"}`}>
                                                {external.lunch ? "Lunch" : "No Lunch"}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="personalDetails" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Contact Details</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-1 text-sm">
                                                        <p><span className="text-gray-500">Email:</span> {external.email_id || "N/A"}</p>
                                                        <p><span className="text-gray-500">Phone:</span> {external.contact_number || "N/A"}</p>
                                                        <p><span className="text-gray-500">Gender:</span> {external.gender || "N/A"}</p>
                                                        <p><span className="text-gray-500">Accommodation:</span> {external.accommodation || "N/A"}</p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="preferences" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Preferences</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                                        {Array.isArray(external.committee_preferences) ? (
                                                            external.committee_preferences.map((pref, idx) => (
                                                                <p key={idx}>{idx + 1}. {pref}</p>
                                                            ))
                                                        ) : (
                                                            Object.entries(external.committee_preferences || {}).map(
                                                                ([key, val], idx) => (
                                                                    <div key={key} className="bg-gray-50 p-2 rounded">
                                                                        <p className="font-medium">{idx + 1}. {val?.committee || "N/A"}</p>
                                                                        <p className="text-gray-500 text-xs">{val?.allotments?.join(", ") || "No preferences"}</p>
                                                                    </div>
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="experience" className="border-b-0">
                                                <AccordionTrigger className="text-sm py-2">Experience</AccordionTrigger>
                                                <AccordionContent>
                                                    {typeof external.experience === 'string' ? (
                                                        <p className="text-sm">{external.experience}</p>
                                                    ) : (
                                                        <div className="space-y-2 text-sm">
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <p className="font-medium">As Delegate: {external.experience?.delegate?.muns || 0} MUNs</p>
                                                                <p className="text-gray-500 text-xs">{external.experience?.delegate?.experience || "N/A"}</p>
                                                            </div>
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <p className="font-medium">As EB: {external.experience?.eb?.muns || 0} MUNs</p>
                                                                <p className="text-gray-500 text-xs">{external.experience?.eb?.experience || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Sheet onOpenChange={(open) => open && openEditSheet(external)}>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full border-[#FF0040] text-[#FF0040] hover:bg-[#FF0040] hover:text-white">
                                                    Edit Allotment
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Edit Allotment</SheetTitle>
                                                    <SheetDescription>
                                                        Update allotment for {external.participant_name}
                                                    </SheetDescription>
                                                </SheetHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Committee</Label>
                                                        <select
                                                            value={editingDelegateId === external._id ? selectedCommitteeForEdit : (external.allotment_committee || "")}
                                                            onChange={(e) => handleCommitteeSelectChange(external._id, e.target.value, "external")}
                                                            className="w-full border rounded-md px-3 py-2 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                                        >
                                                            <option value="" disabled>Select Committee</option>
                                                            {getCommitteesFromPreferences(external).map((committee) => (
                                                                <option key={committee} value={committee}>{committee}</option>
                                                            ))}
                                                            <option value="__other__" className="text-gray-500">-- Other (Custom) --</option>
                                                        </select>
                                                        {selectedCommitteeForEdit === "__other__" && editingDelegateId === external._id && (
                                                            <Input
                                                                placeholder="Enter custom committee"
                                                                className="mt-2"
                                                                onChange={(e) => handleExternalChange(external._id, "allotment_committee", e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Portfolio</Label>
                                                        {(() => {
                                                            const currentCommittee = editingDelegateId === external._id ? selectedCommitteeForEdit : (external.allotment_committee || "");
                                                            const portfolios = getPortfoliosForCommittee(external, currentCommittee);
                                                            const hasPortfolioOptions = portfolios.length > 0 && currentCommittee !== "__other__";
                                                            if (!hasPortfolioOptions || showCustomPortfolio) {
                                                                return (
                                                                    <Input
                                                                        value={editingDelegateId === external._id && showCustomPortfolio ? customPortfolioValue : (external.allotment_portfolio || "")}
                                                                        onChange={(e) => handleCustomPortfolioChange(external._id, e.target.value, "external")}
                                                                        placeholder="Enter portfolio"
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <>
                                                                    <select
                                                                        value={external.allotment_portfolio || ""}
                                                                        onChange={(e) => handlePortfolioSelectChange(external._id, e.target.value, "external")}
                                                                        className="w-full border rounded-md px-3 py-2 focus:ring-[#FF0040] focus:border-[#FF0040]"
                                                                    >
                                                                        <option value="" disabled>Select Portfolio</option>
                                                                        {portfolios.map((portfolio) => (
                                                                            <option key={portfolio} value={portfolio}>{portfolio}</option>
                                                                        ))}
                                                                        <option value="__other__" className="text-gray-500">-- Other (Custom) --</option>
                                                                    </select>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Payment Status</Label>
                                                        <select
                                                            defaultValue={external.paid?.toString() || "false"}
                                                            onChange={(e) => handleExternalChange(external._id, "paid", e.target.value === "true")}
                                                            className="w-full border rounded-md px-3 py-2"
                                                        >
                                                            <option value="true">Paid</option>
                                                            <option value="false">Unpaid</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lunch Status</Label>
                                                        <select
                                                            defaultValue={external.lunch?.toString() || "false"}
                                                            onChange={(e) => handleExternalChange(external._id, "lunch", e.target.value === "true")}
                                                            className="w-full border rounded-md px-3 py-2"
                                                        >
                                                            <option value="true">Lunch</option>
                                                            <option value="false">No Lunch</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                        <Button
                                                            onClick={() => updateDelegate("external", external._id, external.participant_name || "", external.allotment_committee, external.allotment_portfolio, external.paid, external.lunch)}
                                                            className="bg-[#FF0040] hover:bg-[#C73C42] text-white"
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
                {activeTab === "delegations" && (
                    <section>
                        <h2 className={`${latoBold.className} text-2xl md:text-3xl mb-6`}>
                            Delegations
                            <span className="text-gray-400 text-lg ml-2">({delegations.length})</span>
                            <Link href="/ext-del" target="_blank" rel="noopener noreferrer" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-[#FF0040] text-white">
                                Add New
                            </Link>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {delegations.map((delegation) => (
                                <Card key={delegation._id} className="bg-white shadow-[0_0_10px_2px_rgba(255,0,64,0.1)] border-0 hover:shadow-[0_0_15px_4px_rgba(255,0,64,0.2)] transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className={`${latoBold.className} text-lg`}>
                                                {delegation.organisation_name || delegation.organisationName || "Organisation not provided"}
                                            </CardTitle>
                                            <span className="px-3 py-1 bg-[#FF0040]/10 text-[#FF0040] rounded-full text-sm font-bold">
                                                {delegation.delegation_strength || delegation.delegationStrength || 0}
                                            </span>
                                        </div>
                                        <CardDescription>
                                            Head: {delegation.head_delegate || delegation.headDelegate || "Not specified"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <span className="text-gray-500">Email:</span>{" "}
                                                <a href={`mailto:${delegation.email_id || delegation.email}`} className="text-[#FF0040] hover:underline">
                                                    {delegation.email_id || delegation.email || "N/A"}
                                                </a>
                                            </p>
                                            <p>
                                                <span className="text-gray-500">Phone:</span>{" "}
                                                <a href={`tel:${delegation.contact_number || delegation.contactNumber}`} className="text-[#FF0040] hover:underline">
                                                    {delegation.contact_number || delegation.contactNumber || "N/A"}
                                                </a>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
export default AdminPage;