import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import names from "../General/Component";
import { refreshPage } from "../General/Functions";

interface MessageList {
    messageID: number;
    senderID: number;
    receiverID: number;
    message: string;
    date: string;
    time: string;
    chatID: number;
}

const MessagesContainer: React.FC<any> = ({ ownMessages, friendMessages, senderName, messages, handleCallAnswer }) => {
    const messagesEndRef = useRef<any>(null);
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    //Combine Two Data Set Into One Data Set
    const combineMessageList: MessageList[] = [...ownMessages, ...friendMessages];

    const toDateTime = (date: string, time: string): Date => {
        return new Date(`${date}T${time}Z`);
    };

    // Sort the combined data by dateTime (ascending)
    const sortedData = combineMessageList.sort((a, b) => {
        const dateTimeA = toDateTime(a.date, a.time);
        const dateTimeB = toDateTime(b.date, b.time);
        return dateTimeA.getTime() - dateTimeB.getTime();
    });

    function handleAnswerCall(answer:any){
        handleCallAnswer(answer);
        if(answer === "decline"){
            refreshPage(2);
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages, sortedData]);


    return <div>
        {messages.map((m: any, index: any) => {
            if (m.text === "Video Call Request") {
                if (m.user === senderName) {
                    return <div key={index}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black", textAlign: "right" }}>
                            <b>{m.user}</b>
                        </Typography>
                        <Paper sx={{
                            maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginLeft: '47%', marginBottom: '3%',
                            '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300 }}>
                                Waiting Accept...
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                                <i>{currentDate}_{currentTime}</i>
                            </Typography>
                        </Paper>
                    </div>
                } else if (m.user !== senderName) {
                    return <div key={index}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                            <b>{m.user}</b>
                        </Typography>
                        <Paper sx={{
                            maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginBottom: '3%',
                            '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300 }}>
                                {m.text}
                                <br/>
                                <Button onClick={() => handleAnswerCall("join")} sx={{ backgroundColor: names.EditButton, color: "white", width:'120px', marginTop: '2%' }}>Join</Button>
                                <Button onClick={() => handleAnswerCall("decline")} sx={{ backgroundColor: names.DeleteButton, color: "white", width:'120px', marginTop: '2%', marginLeft: '10%' }}>Decline</Button>
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                                <i>{currentDate}_{currentTime}</i>
                            </Typography>
                        </Paper>
                    </div>
                }
            } else if (m.text !== "Video Call Request") {
                if (m.user === senderName) {
                    return <div key={index}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black", textAlign: "right" }}>
                            <b>{m.user}</b>
                        </Typography>
                        <Paper sx={{
                            maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginLeft: '47%', marginBottom: '3%',
                            '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300 }}>
                                {m.text}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                                <i>{currentDate}_{currentTime}</i>
                            </Typography>
                        </Paper>
                    </div>

                } else if (m.user !== senderName) {
                    return <div key={index}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                            <b>{m.user}</b>
                        </Typography>
                        <Paper sx={{
                            maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginBottom: '3%',
                            '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300 }}>
                                {m.text}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                                <i>{currentDate}_{currentTime}</i>
                            </Typography>
                        </Paper>
                    </div>
                }
            }
        }
        )}
        <div ref={messagesEndRef} />
    </div >
}

export default MessagesContainer;