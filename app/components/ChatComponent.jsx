"use client"

import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import CustomApp from "./CustomApp";

// generate a unique user id
const generateUserId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 24; i++) {
        if (i % 8 === 0 && i !== 0) {
            result += '-';
        }

        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Authenticate the user, this function just simulates authentication
const authenticateUser = async (USER_ID) => {
    try{
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: USER_ID })
        });

        const data = await response.json();

    } catch (e){
        console.error("Error authenticating user", e);
    }
}

const USER_ID = generateUserId();
//const USER_ID = "000002";

const ChatComponent = ({ APP_ID }) => {

    authenticateUser(USER_ID);

    return (
        <div className="w-screen h-screen">
            <SendbirdProvider
                appId={APP_ID}
                userId={USER_ID}
            >
                <CustomApp />
            </SendbirdProvider>
        </div>
    );
};

export default ChatComponent;