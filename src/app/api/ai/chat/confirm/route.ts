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

        // Forward request to local API if configured, otherwise fallback to Hugging Face
        const baseUrl = process.env.AI_API_URL || "https://muhammadmahmoud-aoun-ai.hf.space";
        const targetUrl = `${baseUrl.replace(/\/$/, '')}/api/ai/chat/confirm?confirmation_id=${encodeURIComponent(confirmationId)}&approved=${approved}`;
        
        const hfResponse = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": "dev-awn-ai-service-key-2026",
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
