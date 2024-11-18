import { Paper } from "@mui/material"
import Grid from '@mui/material/Grid2';
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import { useEffect, useState } from "react";
import axios from "axios";
import names from "../General/Component";


const ChatBox: React.FC<any> = ({ ownerChatID, friendChatID, currentUserID, selectedChatData }) => {
    // const { chatID, name, chatRole, admin, member, lastDateTime, status, userID } = selectedChatData;
    const currentUserId = currentUserID;
    const [ownMessage, setOwnMessage] = useState<any>([]);
    const [friendMessage, setFriendMessage] = useState<any>([]);
    const [sender, setSender] = useState<any>();
    const [receiver, setReceiver] = useState<any>();

    function getMessageData(){
        axios.get(names.getMessageByChatID + ownerChatID).then((response) =>{
            setOwnMessage(response.data);
        })

        axios.get(names.getMessageByChatID + friendChatID).then((response) =>{
            setFriendMessage(response.data);
        })

        axios.get(names.getChatByID + ownerChatID).then((response) => {
            setSender(response.data.userID);
        })

        axios.get(names.getChatByID + friendChatID).then((response) => {
            setReceiver(response.data.userID);
        })
    }

    useEffect(() => {
        getMessageData()
      }, []);

    return <div>
        <Paper sx={{ width: 600, marginBottom:'-2%', marginLeft:'-2%', marginTop:'-5%', height: '420px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }}}>

            <Grid container spacing={2} alignItems="center">
                <p>Owen Chat Room ID: {ownerChatID}</p>
                <p>Friend Chat Room ID: {friendChatID}</p>

                <Grid size={12} >
                    <MessageContainer ownMessages={ownMessage} friendMessages={friendMessage} sender={sender} receiver={receiver} currentUser = {currentUserId} ownerChatRoomID = {ownerChatID} friendChatRoomID = {friendChatID} />
                </Grid>
                <Grid size={12}>
                    {/* <SendMessageForm sendMessage={sendMessage} /> */}
                </Grid>

            </Grid>
        </Paper>
        {/* <Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: 'mintcream', marginTop: 2 }}>
                        Welcome To {roomName} Chat Room
                    </Typography>
                </Grid>
                <Grid item xs={11}></Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="medium" color="error" onClick={closeConnection} sx={{ marginLeft: -4, marginTop: -4 }}>Leave</Button>
                </Grid>
                <Grid item xs={2} sx={{ backgroundColor: "rgba(25,25,112,0.6)", marginTop: 2, height: 380, borderRadius: '20px', marginLeft: 5, textAlign: "center" }}>
                    <ConnectedUsers users={users} />
                </Grid>
                <Grid item xs={8} sx={{ backgroundColor: "rgba(135,206,250,0.4)", marginTop: 2, height: 380, borderRadius: '20px', marginLeft: 5, overflow: "auto" }}>
                    <MessageContainer messages={messages} users={users} tempName={tempName} />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={8} sx={{ backgroundColor: "rgba(135,206,250,0.0)", marginTop: -1.5, borderRadius: '40px', marginLeft: 10 }}>
                    <SendMessageForm sendMessage={sendMessage} />
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </Grid> */}
    </div>
}

export default ChatBox