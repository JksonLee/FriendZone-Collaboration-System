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
    const chatID = state.chatID?.toString();
    const userName = state.userName;
    const currentUserID = state.currentUserID;
    const theme = state.theme;
    const themeID = state.themeID;
    const token = state.token;
    const userId = state.userId;
    const userInformationList = { currentUserID, theme, themeID };
    const navigate = useNavigate();


    const apiKey = 'mmhfdzb5evj2';
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX01hdWwiLCJ1c2VyX2lkIjoiRGFydGhfTWF1bCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzMyMTE1NDgyLCJleHAiOjE3MzI3MjAyODJ9.pyoqrsgoN67yZdCKeBGL9-m-u6Trgg85eQcuwUpzWUE';
    // const userId = 'Darth_Maul';
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

    // return (
    //     <StreamVideo client={client}>
    //         <StreamCall call={call}>
    //             <MyUILayout />
    //         </StreamCall>
    //     </StreamVideo>
    // );
}

export default VideoCall;