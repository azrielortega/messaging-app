import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { COOKIE_NAME, MAX_AGE } from '@/app/constants';

export async function POST (request){
    const body = await request.json();
    const { username } = body;

    const secret = process.env.JWT_SECRET || "";

    const token = sign({ username }, secret, { expiresIn: MAX_AGE });

    const serialized = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    });

    return new Response(JSON.stringify({ success: true, message : "Authenticated" }), {
        status : 200,
        headers: {
            "Set-Cookie": serialized,
            "Content-Type": "application/json"
        }
    });
}