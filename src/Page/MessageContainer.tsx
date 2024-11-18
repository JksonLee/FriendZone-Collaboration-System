import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";


const MessagesContainer: React.FC<any> = ({ ownMessages, friendMessages, sender, receiver, currentUser, ownerChatRoomID, friendChatRoomID }) => {

    const current = new Date();
    const time = current.toLocaleTimeString("MYT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const messageRef = useRef<any>();

    // useEffect(() => {
    //     if (messageRef.current) {
    //         messageRef.current.scrollTop = messageRef.current.scrollHeight;
    //     }
    // }, [messages]);

    // useEffect(() => {
    //     messageRef.current?.scrollIntoView();
    // }, [messages])


    return <div>
        {/* <p>sender: {sender}</p>
        <p>receiver: {receiver}</p>
        <p>current user: {currentUser}</p> */}
        {ownMessages.map((m: any) =>
            <div key={m.messageID}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                    <b>{m.senderID}</b>&nbsp;&nbsp;<b>[ <i>{time}</i> ]</b>
                </Typography>
                <Paper sx={{
                    maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none',
                    '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                }}>
                    <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300 }}>
                        {m.message}
                    </Typography>
                </Paper>

                <div><br /></div>
                <div ref={messageRef} />
            </div>
        )}
    </div >
}

export default MessagesContainer;