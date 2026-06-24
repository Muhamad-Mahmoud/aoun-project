import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get('auth_token')?.value;
    const hasAuthCookie = Boolean(tokenValue);

    return NextResponse.json(
        { authenticated: hasAuthCookie, token: tokenValue },
        { status: 200 }
    );
}
