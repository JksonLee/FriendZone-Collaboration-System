import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';
import names from '../General/Component';

interface MessageInformation {
    senderID: number;
    receiverID: number;
    message: string;
    date: string;
    time: string;
    chatID: number;
  }

const SendMessageForm: React.FC<any> = ({ sendMessage, ownerChatID, friendChatID, currentUserID, selectedChatData }) => {
    const [message, setMessage] = useState<any>('');
    const [sender, setSender] = useState<any>();
    const [receiver, setReceiver] = useState<any>();
    const [senderName, setSenderName] = useState<any>();
    const [receiverName, setReceiverName] = useState<any>();
    let messageInformation: MessageInformation;
    const now = new Date();

    // function getMessageData() {
    //     axios.get(names.getChatByID + ownerChatID).then((response) => {
    //         setSender(response.data.userID);
    //         axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
    //             setSenderName(response.data.name);
    //         })
    //     })

    //     axios.get(names.getChatByID + friendChatID).then((response) => {
    //         setReceiver(response.data.userID);
    //         axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
    //             setReceiverName(response.data.name);
    //         })
    //     })
    // }

    // useEffect(() => {
    //     getMessageData()
    // }, []);

    
    function messageChange(e: any) {
        setMessage(e.target.value);
    }

    const submitMessage = (e: any) => {
        // const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

        // const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;


        // messageInformation = { senderID: sender, receiverID: receiver, message: message, date: currentDate, time: currentTime, chatID: ownerChatID};

        // axios.post(names.basicMessageAPI, messageInformation);

        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }

    return <div>
        <Grid>
            <Grid container spacing={1}>
                <Grid size={12} sx={{ marginBottom: 3 }}>
                    <TextField id="standard-multiline-flexible" multiline maxRows={2} label="Message..." variant="standard" name="message" value={message} onChange={messageChange} sx={{ width: 500, maxWidth: '100%', marginLeft: 0 }} />
                    <Button variant="contained" color="success" size="medium" disabled={!message} onClick={submitMessage} sx={{ borderRadius: 2, marginTop: 2, marginLeft: 4 }}>Send</Button>
                </Grid>
            </Grid>
        </Grid>
    </div>
}
export default SendMessageForm;