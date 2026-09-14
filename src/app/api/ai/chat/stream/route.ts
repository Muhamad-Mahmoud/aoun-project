import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Read auth token from HttpOnly cookie
        const token = req.cookies.get("auth_token")?.value;
        const body = await req.json();

        // AI backend — server-only env (never NEXT_PUBLIC). Fallback only for local dev.
        const baseUrl = (process.env.AI_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/ai/chat/stream`;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(process.env.AI_API_KEY ? { "X-API-Key": process.env.AI_API_KEY } : {}),
        };

        // Attach JWT Token if available to allow identity propagation to backend tools
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const hfResponse = await fetch(targetUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            // Important for streaming responses
            // @ts-ignore
            duplex: "half", 
        });

        // Forward the response (which is a ReadableStream) directly back to the client
        return new NextResponse(hfResponse.body, {
            status: hfResponse.status,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat proxy error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء الاتصال بالخادم الذكي" },
            { status: 500 }
        );
    }
}
