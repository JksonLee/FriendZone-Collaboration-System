import { Button, CircularProgress, Paper, Typography, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface ChatForm {
    selectedOptions: number[];
}

interface ThemeDetail {
    themeID: number;
    name: string;
    source: string;
}

interface ProfileDetail {
    profileID: number;
    name: string;
    photo: string;
    bio: string;
    onlineStatus: string;
    userID: number;
    themeID: number;
}


const EditProfile: React.FC<any> = ({ currentUserID, userInformationList }) => {
    //Catch The Data
    const { control, handleSubmit } = useForm<ChatForm>({ defaultValues: { selectedOptions: [] } });
    const [loading, setLoading] = useState(false);
    const [friendList, setFriendList] = useState<any>([]);
    const [currentUserName, setCurrentUserName] = useState<any>();
    const [friendThemeDetail, setFriendThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
    const [friendProfileDetail, setFriendProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());
    const now = new Date();
    const navigate = useNavigate();

    //Catch FriendList From DB
    function catchTheme() {
        axios.get(names.getFriendByUserID + currentUserID).then((response) => {
            setFriendList(response.data);
        });

        axios.get(names.getProfileByUserID + currentUserID).then((response) => {
            setCurrentUserName(response.data.name);
        });
    }

    function catchFriendListDetail() {
        friendList.forEach((friend: any) => {
            if (friend.status === "Accept") {
                let friendID: number = friend.friendID;
                axios.get(names.getProfileByID + friend.profileID).then((response) => {
                    if (response.status === 200) {
                        setFriendProfileDetail(prev => new Map(prev).set(friendID, response.data));

                        axios.get(names.getThemeByID + response.data.themeID).then((response) => {
                            setFriendThemeDetail(prev => new Map(prev).set(friendID, response.data));
                        })
                    }
                });
            }
        });
    }

    function checkOnlineStatus(onlineStatus: any) {
        if (onlineStatus === "Offline") {
            return 'gray'
        } else {
            return 'green'
        }
    }

    useEffect(() => {
        catchTheme();
    }, []);

    useEffect(() => {
        catchFriendListDetail();
    }, [friendList]);


    //Submit Form
    const onSubmit = async (data: ChatForm) => {
        let roleExist = "false";

        if (data.selectedOptions.length !== 0) {
            if (data.selectedOptions.length === 1) {
                const friendProfileID = parseInt(data.selectedOptions.join(', '));
                axios.get(names.getProfileByID + friendProfileID).then((response) => {
                    const friendUserID = response.data.userID.toString();
                    const friendProfileDetail = response.data;
                    axios.get(names.getChatByUserID + currentUserID).then((response) => {
                        if (response.status === 200) {
                            (response.data).forEach((element: any) => {
                                if ((element.admin === currentUserID.toString() || element.admin === friendUserID) && (element.member === friendUserID || element.member === currentUserID.toString()) && element.chatRole === "Individual") {
                                    console.log("is true")
                                    roleExist = "true";
                                }
                            });
                            if (roleExist !== "true") {
                                const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

                                const newChatRoomOfOwner = { name: friendProfileDetail.name, chatRole: "Individual", admin: currentUserID.toString(), member: friendUserID, lastDateTime: currentDate, status: "Not Pin", userID: currentUserID }
                                axios.post(names.basicChatAPI, newChatRoomOfOwner);

                                const newChatRoomOfOther = { name: currentUserName, chatRole: "Individual", admin: currentUserID.toString(), member: friendUserID, lastDateTime: currentDate, status: "Not Pin", userID: friendUserID }
                                axios.post(names.basicChatAPI, newChatRoomOfOther);
                            }
                        }

                        navigate('/Home', { state: userInformationList });
                        refreshPage(2);
                    })
                })
            } else if (data.selectedOptions.length > 1) {
                const friendProfileID = data.selectedOptions.join(', ');
                axios.get(names.getChatByUserID + currentUserID).then((response) => {
                    if (response.status === 200) {
                        (response.data).forEach((element: any) => {
                            if (element.admin === currentUserID.toString() && element.member === friendProfileID && element.chatRole === "Group") {
                                console.log("is true")
                                roleExist = "true";
                            }
                        });
                        if (roleExist !== "true") {
                            const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

                            const newChatRoomOfOwner = { name: `${currentUserName}'s Group`, chatRole: "Group", admin: currentUserID.toString(), member: friendProfileID, lastDateTime: currentDate, status: "Not Pin", userID: currentUserID }
                            axios.post(names.basicChatAPI, newChatRoomOfOwner);

                            (friendProfileID.split(', ')).forEach((element: any) => {
                                axios.get(names.getProfileByUserID + parseInt(element)).then((response) => {
                                    const newChatRoomOfOther = { name: `${currentUserName}'s Group`, chatRole: "Group", admin: currentUserID.toString(), member: friendProfileID, lastDateTime: currentDate, status: "Not Pin", userID: response.data.userID }
                                    axios.post(names.basicChatAPI, newChatRoomOfOther);
                                })
                            });
                        }
                    }

                    navigate('/Home', { state: userInformationList });
                    refreshPage(2);
                })
            }
        } else {
            navigate('/Home', { state: userInformationList });
            refreshPage(2);
        }
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Inform Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller
                    name="selectedOptions"
                    control={control}
                    render={({ field }) => (
                        <div>
                            {friendList.map((friend: any) => (
                                <div key={friend.profileID}>
                                    <label>
                                        <Paper sx={{ marginLeft: 3, marginBottom: 3, padding: 1, width: 540, backgroundImage: `url('${friendThemeDetail.get(friend.friendID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px', maxHeight: '60px' }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={2} >
                                                    <Avatar alt={friendProfileDetail.get(friend.friendID)?.name} src={friendProfileDetail.get(friend.friendID)?.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(friend.friendID)?.onlineStatus) }} />
                                                </Grid>
                                                <Grid size={3}>
                                                    <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{friend.name}</strong></Typography>
                                                    <Typography variant="h5" sx={{ fontSize: '20px' }}><i>{friend.position}</i></Typography>
                                                </Grid>
                                                <Grid size={6}>
                                                </Grid>
                                                <Grid size={1}>
                                                    <input
                                                        type="checkbox"
                                                        value={friend.profileID.toString()}
                                                        checked={field.value.includes(friend.profileID)}
                                                        onChange={(e) => {
                                                            // Update the selectedOptions array based on the checkbox state
                                                            const selected = e.target.checked
                                                                ? [...field.value, friend.profileID] // Add id if checked
                                                                : field.value.filter((id) => id !== friend.profileID); // Remove id if unchecked
                                                            field.onChange(selected); // Update form state
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                    {loading ? <CircularProgress size={24} /> : 'Add'}
                </Button>
            </Grid>
        </form>
        <ToastContainer />
    </div>
};

export default EditProfile;