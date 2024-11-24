import { Button, TextField, CircularProgress, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface ChatForm {
    status: string;
}

const EditChat: React.FC<any> = ({ selectedChatData, userInformationList }) => {
    //Catch The Data
    const { control, handleSubmit } = useForm<ChatForm>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //Submit Form
    const onSubmit = async (data: ChatForm) => {
        setLoading(true);

        const chatUpdate = { chatID: selectedChatData.chatID, name: selectedChatData.name, chatRole: selectedChatData.chatRole, admin: selectedChatData.admin, member: selectedChatData.member, lastDateTime: selectedChatData.lastDateTime, status: data.status, userID: selectedChatData.userID }

        axios.put(names.basicChatAPI, chatUpdate);
        navigate('/Home', { state: userInformationList })
        refreshPage(2);
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Online Status Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="status" control={control} defaultValue={selectedChatData.status} rules={{ required: 'Chat Status is required' }}
                    render={({ field }) => (
                        <Select {...field} labelId="status" id="status" label="Select an Chat Status Option" fullWidth >
                            <MenuItem value="Pin">Pin</MenuItem>
                            <MenuItem value="Not Pin">Not Pin</MenuItem>
                        </Select>)} />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.EditButton }}>
                    {loading ? <CircularProgress size={24} /> : 'Done Edit'}
                </Button>
            </Grid>
        </form>
        <ToastContainer />
    </div>
};

export default EditChat;