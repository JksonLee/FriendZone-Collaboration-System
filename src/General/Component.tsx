const names = {
  //Button
  ButtonColor: 'rgba(105, 105, 105, 0.5)',
  EditButton: 'rgba(70, 130, 180, 0.5)',
  DeleteButton: 'rgba(255, 0, 0, 0.5)',

  //Box
  BoxRadius: '35px',
  BoxBackgroundColor: 'rgba(245, 245, 245, 0.7)',

  //Text
  TextColor: 'black',

  //ChatAssistant
  basicChatAssistantAPI: `http://localhost:7121/api/ChatAssistant`,
  getChatAssistantByID: `http://localhost:7121/api/ChatAssistant/`,

  //User DB
  basicUserAPI: `http://localhost:7121/api/User`,
  getUserByUserEmail: `http://localhost:7121/api/User/userEmail/`,
  getUserByID: `http://localhost:7121/api/User/`,

  //Theme DB
  basicThemeAPI: `http://localhost:7121/api/Theme`,
  getThemeByID: `http://localhost:7121/api/Theme/`,
  getThemeID1: `http://localhost:7121/api/Theme/1`,

  //Profile DB
  basicProfileAPI: `http://localhost:7121/api/Profile`,
  getProfileByID: `http://localhost:7121/api/Profile/`,
  getProfileByUserID: `http://localhost:7121/api/Profile/userID/`,
  getProfileByUserName: `http://localhost:7121/api/Profile/userName/`,

  //Action DB
  basicActionAPI: `http://localhost:7121/api/Action`,
  getActionByUserID: `http://localhost:7121/api/Action/userID/`,

  //Report DB
  basicReportAPI: `http://localhost:7121/api/Report`,
  getReportByUserID: `http://localhost:7121/api/Report/userID/`,

  //Message DB
  basicMessageAPI: `http://localhost:7121/api/Message`,
  getMessageByUserID: `http://localhost:7121/api/Message/userID/`,

  //Friend DB
  basicFriendAPI: `http://localhost:7121/api/Friend`,
  getFriendByID: `http://localhost:7121/api/Friend/`,
  getFriendByUserID: `http://localhost:7121/api/Friend/userID/`,
  getFriendByUserName: `http://localhost:7121/api/Friend/userName/`,

  //Chat DB
  basicChatAPI: `http://localhost:7121/api/Chat`,
  getChatByUserID: `http://localhost:7121/api/Chat/userID/`,

  //Calendar DB
  basicCalendarAPI: `http://localhost:7121/api/Calendar`,
  getCalendarByUserID: `http://localhost:7121/api/Calendar/userID/`,

};

export default names;