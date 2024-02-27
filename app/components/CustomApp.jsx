"use client"

import { useState, useEffect } from 'react';
import SBConversation from '@sendbird/uikit-react/GroupChannel'
import SBChannelList from '@sendbird/uikit-react/GroupChannelList'
import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings';
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";

import '@sendbird/uikit-react/dist/index.css';

const generateRandomName = () => {
    const characters = '0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `SendBird-${result}`;
}

const createUser = async (userId, nickname, profileUrl) => {
    const response = await fetch('/api/createuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userId,
            nickname: nickname,
            profileURL: profileUrl
        })
    });

    const data = await response.json();
}

const CustomApp = () => {

    const [currentChannel, setCurrentChannel] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [added, setAdded] = useState(false);
    const [namechange, setNameChange] = useState(false);

    const globalStore = useSendbirdStateContext();
    const updateUser = sendbirdSelectors.getUpdateUserInfo(globalStore);

    const user = globalStore?.stores?.userStore?.user;
    const currentChannelUrl = currentChannel ? currentChannel.url : "";

    const newNickname = "New User";

    if (user.nickname === "") {
        updateUser(newNickname, user.plainProfileUrl)
            .then((user) => {})
            .catch((error) => { console.warn(error) });
    }

    useEffect(() => {
        if (!added && user.userId !== undefined) {
            setAdded(true);
            createUser(user.userId, newNickname, user.plainProfileUrl);
        }
    }, [added, user, updateUser, newNickname])

    const handleUpdateUser = async (user) => {
        const response = await fetch('/api/updateuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: user.userId,
                nickname: user.nickname,
                profileURL: user.plainProfileUrl
            })
        });

        const data = await response.json();
    }

    const handleCreateChannel = async (channel) => {

        const response = await fetch('/api/createchannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(channel)
        });

        const data = await response.json();
    }

    return (
        <div className="channel-wrap h-screen w-screen flex">
            <div className="channel-list">
                <SBChannelList
                    onChannelCreated={(channel) => {
                        handleCreateChannel(channel);
                        setCurrentChannel(channel)
                    }}

                    onChannelSelect={(channel) => {
                        setCurrentChannel(channel);
                    }}

                    onChannelModified={(channel) => {
                    }}

                    onUserProfileUpdated={async (user) => {
                        await updateUser(user.nickname, user.plainProfileUrl)
                            .then((user) => {
                                handleUpdateUser(user);
                            })
                            .catch((error) => { console.warn(error) });

                    }}

                    disableAutoSelect
                    allowProfileEdit={true}
                />
            </div>
            <div className="channel-chat w-screen">
                <SBConversation
                    channelUrl={currentChannelUrl}
                    onChatHeaderActionClick={() => {
                        setShowSettings(!showSettings);
                    }}

                    on
                />
            </div>
            {showSettings && (
                <div className="channel-settings">
                    <SBChannelSettings
                        channelUrl={currentChannelUrl}
                        onCloseClick={() => {
                            setShowSettings(!showSettings);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomApp;