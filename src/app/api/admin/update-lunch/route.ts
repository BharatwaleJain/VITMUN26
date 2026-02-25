import clientPromise from "../../../../../lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { errorResponse } from "../../../../../lib/db";
import { verifyAdminFromCookie } from "@/lib/adminAuth";
export async function POST(req: NextRequest) {
    const admin = verifyAdminFromCookie();
    if (!admin) {
        return errorResponse("Unauthorized", 401);
    }
    try {
        const client = await clientPromise;
        const db = client.db("delegateallotments");
        const internalUpdate = await db.collection("internal").updateMany({}, { $set: { lunch: false } });
        const externalUpdate = await db.collection("external").updateMany({}, { $set: { lunch: false } });
        return NextResponse.json({
            success: true,
            message: "Lunch status reset for all delegates.",
            internalUpdated: internalUpdate.modifiedCount,
            externalUpdated: externalUpdate.modifiedCount,
        });
    } catch (error) {
        console.error("Error updating lunch status:", error);
        return NextResponse.json({ success: false, error: "Failed to reset lunch status" }, { status: 500 });
    }
}