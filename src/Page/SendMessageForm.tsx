import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

const SendMessageForm: React.FC<any> = ({ sendMessage }) => {

    const [message, setMessage] = useState<any>('');
    function messageChange(e: any) {
        setMessage(e.target.value);
    }

    const submitMessage = (e: any) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');

    }

    return <div>
        <Grid>
            <Grid container spacing={2}>
                <Grid size={12} sx={{ marginBottom: 3 }}>
                    <TextField id="standard-multiline-flexible" multiline maxRows={2} label="Message..." variant="standard" name="message" value={message} onChange={messageChange} sx={{ width: 480, maxWidth: '100%', marginLeft: 4 }} />
                    <Button variant="contained" color="success" size="medium" disabled={!message} onClick={submitMessage} sx={{ borderRadius: 2, marginTop: 2, marginLeft: 4 }}>Send</Button>
                </Grid>
            </Grid>
        </Grid>
    </div>
}
export default SendMessageForm;