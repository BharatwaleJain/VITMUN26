import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const committee = searchParams.get("committee");
        let client;
        try {
            client = await clientPromise;
        } catch (connError) {
            console.error("MongoDB connection error:", connError);
            return NextResponse.json(
                { success: false, error: "Database connection failed. Please try again." },
                { status: 503 }
            );
        }
        const db = client.db("delegateallotments");
        // Only show delegates who are allocated and paid
        const query: Record<string, unknown> = {
            allotment_portfolio: { $exists: true, $nin: [null, ""] },
            allotment_committee: { $exists: true, $nin: [null, ""] },
            paid: true,
        };
        if (committee) {
            query.allotment_committee = committee;
        }
        // Fetch data from both external and internal collections
        const [externalData, internalData] = await Promise.all([
            db
                .collection("external")
                .find(query, {
                    projection: { participant_name: 1, allotment_portfolio: 1 },
                })
                .toArray(),
            db
                .collection("internal")
                .find(query, {
                    projection: { participant_name: 1, allotment_portfolio: 1 },
                })
                .toArray(),
        ]);
        // Combine data already filtered by query
        const combinedData = [...externalData, ...internalData].filter(
            (item) => item.allotment_portfolio && item.allotment_portfolio.trim() !== ""
        );
        return NextResponse.json({ success: true, data: combinedData });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}