import { NextRequest } from "next/server";
import {
    getCollection,
    successResponse,
    errorResponse,
} from "../../../../../lib/db";
const COLLECTION = "delegations";
/**
 * GET /api/admin/delegations
 * Fetch all delegations
 */
export async function GET() {
    try {
        const collection = await getCollection(COLLECTION);
        const data = await collection.find({}).toArray();
        return successResponse(data);
    } catch (error) {
        console.error("Error fetching delegations:", error);
        return errorResponse("Failed to fetch delegations");
    }
}
/**
 * POST /api/admin/delegations
 * Create a new delegation
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { organisation_name, head_delegate, email_id, contact_number, delegation_strength } = body;
        if (!organisation_name || !head_delegate || !email_id || !contact_number || !delegation_strength) {
            return errorResponse("Missing required fields", 400);
        }
        const collection = await getCollection(COLLECTION);
        const newDelegation = {
            organisation_name,
            head_delegate,
            email_id,
            contact_number,
            delegation_strength: Number(delegation_strength),
        };
        const result = await collection.insertOne(newDelegation);
        return successResponse({ insertedId: result.insertedId }, 201);
    } catch (error) {
        console.error("Error creating delegation:", error);
        return errorResponse("Failed to create delegation");
    }
}