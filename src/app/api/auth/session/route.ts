import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const hasAuthCookie = Boolean(cookieStore.get('auth_token')?.value);

    return NextResponse.json(
        { authenticated: hasAuthCookie },
        { status: 200 }
    );
}
