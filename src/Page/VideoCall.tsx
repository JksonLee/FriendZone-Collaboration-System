import {
    CallControls, CallingState, SpeakerLayout, StreamCall,
    StreamTheme, StreamVideo, StreamVideoClient, useCallStateHooks,
    User
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import '../CSS/VideoCall.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface UserInformation {
    chatID: string;
    userName: string;
    currentUserID: number;
    theme: string;
    themeID: number;
    token: string;
    userId: string;
}

const VideoCall: React.FC<any> = () => {
    const location = useLocation();
    const state = location.state as UserInformation;
    const chatID = state?.chatID.toString();
    const userName = state?.userName;
    const currentUserID = state?.currentUserID;
    const theme = state?.theme;
    const themeID = state?.themeID;
    const token = state?.token;
    const userId = state?.userId;
    const userInformationList = { currentUserID, theme, themeID };
    const navigate = useNavigate();


    const apiKey = 'mmhfdzb5evj2';
    const callId = chatID;

    const user: User = {
        id: userId,
        name: userName,
    };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('default', callId);
    call.join({ create: true });

    function App() {
        return (
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <MyUILayout />
                </StreamCall>
            </StreamVideo>
        );
    }

    const MyUILayout = () => {
        const { useCallCallingState } = useCallStateHooks();
        const callingState = useCallCallingState();

        if (callingState === CallingState.LEFT) {
            navigate('/Home', { state: userInformationList });
            refreshPage(2)
        }

        return (
            <StreamTheme>
                <SpeakerLayout participantsBarPosition='bottom' />
                <CallControls />
            </StreamTheme>
        );
    };


    return (
        App()
    );
}

export default VideoCall;