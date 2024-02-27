import { createChannel, createChannelsTable } from "@/app/lib/repository/channel";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/app/constants";
import { verify } from "jsonwebtoken";

export async function POST(request) {
    try{
        // Check if user is authenticated
        const cookieStore = cookies();
        const token = cookieStore.get(COOKIE_NAME);

        if (!token) throw new Error("Unauthorized");
        
        const { value } = token;
        verify (value, process.env.JWT_SECRET);

        //get body
        const body = await request.json();

        const channelUrl = body._url;
        const createdBy = body.creator.userId;
        const chatmateIdentifier = body._name;
        const members = body.members.map(member => member.userId);

        // add table if channels table doesn't exist
        await createChannelsTable();

        // creat channel
        await createChannel(channelUrl, createdBy, chatmateIdentifier, members);

        return new Response(JSON.stringify({ success : true, message: "Channel created" }))
    } catch(error){
        return new Response(JSON.stringify({ success : false, message: "Channel not created" }))
    }
}