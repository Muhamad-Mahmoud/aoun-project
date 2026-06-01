import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Read auth token from HttpOnly cookie
        const token = req.cookies.get("auth_token")?.value;
        const body = await req.json();

        // Forward request directly to Hugging Face
        const targetUrl = "https://muhammadmahmoud-aoun-ai.hf.space/api/ai/chat/stream";
        
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-API-Key": "dev-key", // The current API Key expected by Aoun-Ai
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
