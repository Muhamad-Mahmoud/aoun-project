import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ai/voice
 * Proxies voice uploads to the AI backend streaming SSE endpoint.
 * Uses /api/ai/voice/stream to get SSE back instead of a plain JSON response.
 */
export async function POST(request: NextRequest) {
    const AI_API_URL = (process.env.AI_API_URL || 'http://127.0.0.1:8000')
        .replace('localhost', '127.0.0.1')
        .replace(/\/$/, '');
    const targetUrl = `${AI_API_URL}/api/ai/voice/stream`;

    try {
        const formData = await request.formData();

        const outgoing = new FormData();
        for (const [key, value] of formData.entries()) {
            outgoing.append(key, value);
        }

        // Inject auth token from cookie if not already in form
        if (!formData.has('access_token')) {
            const token = request.cookies.get('auth_token');
            if (token) {
                outgoing.append('access_token', token.value);
            }
        }

        const response = await fetch(targetUrl, {
            method: 'POST',
            body: outgoing,
            // Don't set Content-Type — fetch auto-generates correct multipart boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Voice Proxy] Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Voice processing failed', details: errorText },
                { status: response.status }
            );
        }

        // Stream the SSE response back to the client as-is
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('content-encoding');

        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[Voice Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to AI voice service', details: String(error) },
            { status: 502 }
        );
    }
}
