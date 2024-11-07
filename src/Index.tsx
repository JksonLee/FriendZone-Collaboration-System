import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './Page/WelcomePage';
import Login from './Page/Login';
import Register from './Page/Register';
import RegisterProfile from './Page/RegisterProfile';
import ForgetPassword from './Page/ForgetPassword';
import Home from './Page/Home';
import Profile from './Page/Profile';
import FriendList from './Page/FriendList';
import AddNewFriend from './Page/AddNewFriend';
import Calendar from './Page/Calendar';
import ErrorPage from './Page/ErrorPage';


const Index = () => {
    return <div>
        <Router>
            <Routes>
                <Route path='/' element={<WelcomePage />}/>
                <Route path='/Login' element={<Login />}/>
                <Route path='/Register' element={<Register />}/>
                <Route path='/RegisterProfile' element={<RegisterProfile />}/>
                <Route path='/ForgetPassword' element={<ForgetPassword />}/>
                <Route path='/Home' element={<Home />}/>
                <Route path='/Profile' element={<Profile />}/>
                <Route path='/FriendList' element={<FriendList />}/>
                <Route path='/AddNewFriend' element={<AddNewFriend />}/>
                <Route path='/Calendar' element={<Calendar />}/>
                <Route path='/ErrorPage' element={<ErrorPage />}/>
            </Routes>
        </Router>
    </div>
}

export default Index;