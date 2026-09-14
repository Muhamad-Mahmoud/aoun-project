import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const confirmationId = searchParams.get("confirmation_id");
        const approved = searchParams.get("approved");

        if (!confirmationId || !approved) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // AI backend — server-only env (never NEXT_PUBLIC). Fallback only for local dev.
        const baseUrl = (process.env.AI_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/ai/chat/confirm?confirmation_id=${encodeURIComponent(confirmationId)}&approved=${approved}`;

        const hfResponse = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(process.env.AI_API_KEY ? { "X-API-Key": process.env.AI_API_KEY } : {}),
            },
        });

        const data = await hfResponse.json();

        return NextResponse.json(data, {
            status: hfResponse.status,
        });
    } catch (error) {
        console.error("Chat confirm proxy error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء الاتصال بالخادم الذكي" },
            { status: 500 }
        );
    }
}
