import { Button, Grid } from "@mui/material";
import { useState } from "react";
import App from "./App";
import VideoCall from "./Page/VideoCall";

const Testing: React.FC<any> = () => {
    const [showApp, setShowApp] = useState(false);

  // Toggle the state to show/hide the App component
  const handleButtonClick = () => {
    setShowApp(!showApp);
  };


    return (
        <div>
          <h1>This is the Main Component</h1>
          
          {/* Button to toggle the App component */}
          <button onClick={handleButtonClick}>
            {showApp ? 'Hide App' : 'Show App'}
          </button>
    
          {/* Conditionally render the App component */}
          {showApp && <VideoCall />} {/* If showApp is true, render the App component */}
        </div>
      );
}

export default Testing;