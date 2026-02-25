import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    if (
        path.startsWith("/api/admin") &&
        !path.startsWith("/api/admin/login")
    ) {
        const token = request.cookies.get("admin_token")?.value
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
    }
    return NextResponse.next()
}
export const config = {
    matcher: ["/api/admin/:path*"],
}