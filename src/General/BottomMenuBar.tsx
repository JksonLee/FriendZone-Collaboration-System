import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { refreshPage } from './Functions';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

//TypeScript
interface ErrorMessage {
  errorMessage: string;
  page: string;
}

export default function BottomMenuBar(userInformationList: any, currentDirection: string) {
  const navigate = useNavigate();
  let errorMessage: ErrorMessage;
  const [value, setValue] = useState<string>(currentDirection);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    // direction = newValue;
  };

  useEffect(() => {
    switch (value) {
      case "main":
        navigate('/Home', { state: userInformationList });
        break;

      case "friend":
        navigate('/FriendList', { state: userInformationList });
        break;

      case "search":
        navigate('/AddNewFriend', { state: userInformationList });
        break;

      case "calendar":
        navigate('/Calendar', { state: userInformationList });
        break;

      case "profile":
        navigate('/Profile', { state: userInformationList });
        break;

      default:
        errorMessage = { errorMessage: "Something Is Wrong, Please Refresh The Page Again, Sorry~", page: " " };
        navigate('/ErrorPage', { state: errorMessage });
        refreshPage(2);
        break;
    };
  }, [value]);



  // function changeDirection(direction:string){
  //   switch (direction) {
  //     case "main":
  //       navigate('/Home', { state: userInformationList });
  //       break;

  //     case "friend":
  //       navigate('/FriendList', { state: userInformationList });
  //       break;

  //     case "search":
  //       navigate('/AddNewFriend', { state: userInformationList });
  //       break;

  //     case "calendar":
  //       navigate('/Calendar', { state: userInformationList });
  //       break;

  //     case "profile":
  //       navigate('/Profile', { state: userInformationList });
  //       break;

  //     default:
  //       errorMessage = { errorMessage: "Something Is Wrong, Please Refresh The Page Again, Sorry~", page: " " };
  //       navigate('/ErrorPage', { state: errorMessage });
  //       refreshPage(2);
  //       break;
  //   };
  // };

  return <div>
    <hr style={{ border: '1px solid gray', width: 1100 }} />

    <BottomNavigation value={value} onChange={handleChange} sx={{ backgroundColor: 'transparent', boxShadow: 'none', width: 1100 }}>
      <BottomNavigationAction label="Main Page" value="main" icon={<HomeIcon />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
      <BottomNavigationAction label="Friend List" value="friend" icon={<PeopleAltIcon />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
      <BottomNavigationAction label="Search Friend" value="search" icon={<SearchIcon />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
      <BottomNavigationAction label="Calendar" value="calendar" icon={<CalendarMonthIcon />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
      <BottomNavigationAction label="Profile" value="profile" icon={<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
    </BottomNavigation>
  </div>
}
