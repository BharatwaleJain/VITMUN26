import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export function generateAdminToken() {
    return jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET!,
        { expiresIn: "2h" }
    );
}
export async function verifyAdminFromCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token)
        return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
        return null;
    }
}