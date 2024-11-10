const names = {
  //Button
  ButtonColor: 'rgba(105,105,105, 0.5)',

  //Box
  BoxRadius: '35px',
  BoxBackgroundColor: 'rgba(245, 245, 245, 0.7)',

  //Text
  TextColor: 'black',

  //User DB
  basicUserAPI: `http://localhost:7121/api/User`,
  getUserByUserEmail: `http://localhost:7121/api/User/userEmail/`,

  //Profile DB
  basicProfileAPI: `http://localhost:7121/api/Profile`,
  getProfileByUserID: `http://localhost:7121/api/Profile/userID/`,

  //Theme DB
  basicThemeAPI: `http://localhost:7121/api/Theme`,
  getThemeByID: `http://localhost:7121/api/Theme/`,
  getThemeID1: `http://localhost:7121/api/Theme/1`,
};

export default names;