import { createUser, createUserTable } from "@/app/lib/repository/user";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/app/constants";
import { verify } from "jsonwebtoken";


export async function POST(request) {
    try{
        // check if user is authenticated
        const cookieStore = cookies();
        const token = cookieStore.get(COOKIE_NAME);

        if (!token) throw new Error("Unauthorized");
        
        const { value } = token;
        verify (value, process.env.JWT_SECRET);

        // get body of request
        const body = await request.json();
        const { nickname, userID, profileURL } = body;

        // create user table if it doesn't exist
        await createUserTable();

        // create user
        await createUser(userID, nickname, profileURL);

        return new Response(JSON.stringify({ success : true, message: "User created" }))
    } catch(error){
        return new Response(JSON.stringify({ success : false, message: "An error has occured" }))
    }
}