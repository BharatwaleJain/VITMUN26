import { NextRequest } from "next/server";
import {
    getCollection,
    successResponse,
    errorResponse,
    DelegateType,
    getCollectionName,
} from "../../../../../lib/db";
/**
  GET /api/admin/delegates?type=internal|external
  Fetch a single delegate by name (case-insensitive)
*/
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as DelegateType;
        const name = searchParams.get("name");
        if (!type || !["internal", "external"].includes(type)) {
            return errorResponse("Missing or invalid 'type' parameter. Use 'internal' or 'external'.", 400);
        }
        const collection = await getCollection(getCollectionName(type));
        // If name is provided, fetch single delegate by name
        if (name) {
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const delegate = await collection.findOne({
                participant_name: { $regex: new RegExp(`^${escapedName}$`, 'i') }
            });
            if (!delegate) {
                return errorResponse("Delegate not found.", 404);
            }
            return successResponse(delegate);
        }
        // Otherwise, fetch all delegates
        const data = await collection.find({}).toArray();
        return successResponse(data);
    } catch (error) {
        console.error("Error fetching delegates:", error);
        return errorResponse("Failed to fetch delegates");
    }
}
/**
 * POST /api/admin/delegates
 * Create a new delegate
 * Body: { type: "internal" | "external", ...delegateData }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, ...delegateData } = body;
        if (!type || !["internal", "external"].includes(type)) {
            return errorResponse("Missing or invalid 'type' in request body.", 400);
        }
        const collection = await getCollection(getCollectionName(type));
        const newDelegate = {
            participant_name: delegateData.participant_name,
            email_id: delegateData.email_id,
            contact_number: delegateData.contact_number,
            allotment_committee: delegateData.allotment_committee || null,
            allotment_portfolio: delegateData.allotment_portfolio || null,
            paid: delegateData.paid ?? false,
            gender: delegateData.gender || null,
            organisation_name: delegateData.organisation_name || null,
            accommodation: delegateData.accommodation || null,
            committee_preferences: delegateData.committee_preferences || null,
            experience: delegateData.experience || null,
            registration_number: delegateData.registration_number || null,
            lunch: delegateData.lunch ?? false,
        };
        const result = await collection.insertOne(newDelegate);
        return successResponse({ insertedId: result.insertedId }, 201);
    } catch (error) {
        console.error("Error creating delegate:", error);
        return errorResponse("Failed to create delegate");
    }
}
/**
 * PUT /api/admin/delegates
 * Update a delegate by name (case-insensitive)
 * Body: { type: "internal" | "external", name: string, ...fieldsToUpdate }
 */
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, type, ...updateData } = body;
        if (!type || !["internal", "external"].includes(type)) {
            return errorResponse("Missing or invalid 'type' in request body.", 400);
        }
        if (!name) {
            return errorResponse("Missing 'name' in request body.", 400);
        }
        const collection = await getCollection(getCollectionName(type));
        // Only update fields that are provided
        const allowedFields = [
            "allotment_committee",
            "allotment_portfolio",
            "paid",
            "lunch",
            "participant_name",
            "email_id",
            "contact_number",
            "gender",
            "organisation_name",
            "accommodation",
            "committee_preferences",
            "experience",
            "registration_number",
        ];
        const updateFields: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                updateFields[field] = updateData[field];
            }
        }
        if (Object.keys(updateFields).length === 0) {
            return errorResponse("No valid fields to update.", 400);
        }
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const result = await collection.updateOne(
            { participant_name: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
            { $set: updateFields }
        );
        if (result.matchedCount === 0) {
            return errorResponse("Delegate not found.", 404);
        }
        return successResponse({ modified: result.modifiedCount > 0 });
    } catch (error) {
        console.error("Error updating delegate:", error);
        return errorResponse("Failed to update delegate");
    }
}
/**
 * DELETE /api/admin/delegates
 * Delete a delegate by name (case-insensitive)
 * Body: { type: "internal" | "external", name: string }
 */
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, type } = body;
        if (!type || !["internal", "external"].includes(type)) {
            return errorResponse("Missing or invalid 'type' in request body.", 400);
        }
        if (!name) {
            return errorResponse("Missing 'name' in request body.", 400);
        }
        const collection = await getCollection(getCollectionName(type));
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const result = await collection.deleteOne({
            participant_name: { $regex: new RegExp(`^${escapedName}$`, 'i') }
        });
        if (result.deletedCount === 0) {
            return errorResponse("Delegate not found or already deleted.", 404);
        }
        return successResponse({ deleted: true });
    } catch (error) {
        console.error("Error deleting delegate:", error);
        return errorResponse("Failed to delete delegate");
    }
}