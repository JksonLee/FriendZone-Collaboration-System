import { useLocation } from 'react-router-dom';

interface UserID {
  currentUserID: number;
  theme: string;
}

const Home = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserID;

  const style={
    backgroundImage: `url('${state?.theme}')`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }

    return <div style={style}>
      <h2>ID: {state?.currentUserID}</h2>
      <h2>{state?.theme}</h2>
  </div>
}

export default Home