import { Collection, Db, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
const DB_NAME = "delegateallotments";
export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(DB_NAME);
}
export async function getCollection(name: string): Promise<Collection> {
    const db = await getDb();
    return db.collection(name);
}
export function toObjectId(id: string): ObjectId {
    return new ObjectId(id);
}
export function successResponse(data: unknown, status = 200) {
    return Response.json({ success: true, data }, { status });
}
export function errorResponse(message: string, status = 500) {
    return Response.json({ success: false, error: message }, { status });
}
export type DelegateType = "internal" | "external";
export function getCollectionName(type: DelegateType): string {
    return type === "external" ? "external" : "internal";
}