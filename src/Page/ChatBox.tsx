import Grid from '@mui/material/Grid2';
import MessageContainer from "./MessageContainer";
import { useEffect, useState } from "react";
import axios from "axios";
import names from "../General/Component";


const ChatBox: React.FC<any> = ({ ownerChatID, friendChatID, currentUserID, messages, handleCallAnswer }) => {
    const currentUserId = currentUserID;
    const [ownMessage, setOwnMessage] = useState<any>([]);
    const [friendMessage, setFriendMessage] = useState<any>([]);
    const [sender, setSender] = useState<any>();
    const [receiver, setReceiver] = useState<any>();
    const [senderName, setSenderName] = useState<any>();
    const [receiverName, setReceiverName] = useState<any>();

    function getMessageData() {
        axios.get(names.getMessageByChatID + ownerChatID).then((response) => {
            setOwnMessage(response.data);
        })

        axios.get(names.getMessageByChatID + friendChatID).then((response) => {
            setFriendMessage(response.data);
        })

        axios.get(names.getChatByID + ownerChatID).then((response) => {
            setSender(response.data.userID);
            axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
                setSenderName(response.data.name);
            })
        })

        axios.get(names.getChatByID + friendChatID).then((response) => {
            setReceiver(response.data.userID);
            axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
                setReceiverName(response.data.name);
            })
        })
    }

    useEffect(() => {
        getMessageData()
    }, []);

    return <div>
        <Grid container spacing={1} alignItems="center">
            <Grid size={12} >
                <MessageContainer ownMessages={ownMessage} friendMessages={friendMessage} senderName={senderName} messages={messages} handleCallAnswer={handleCallAnswer} />
            </Grid>
        </Grid>
    </div>
}

export default ChatBox