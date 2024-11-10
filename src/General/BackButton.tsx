import { useNavigate } from 'react-router-dom';
import componentNames from './Component';
import '../CSS/BackButton.css'

const BackButton: React.FC = () => {
  const navigate = useNavigate();


  // Go back to the previous page in history
  const handleGoBack = () => {
    navigate(-1);

    // Reload the page after navigation
    setTimeout(() => {
      window.location.reload();
    }, 5);
  };

  return (
    <button onClick={handleGoBack} className="back-button" style={{ '--Color': componentNames.TextColor } as React.CSSProperties}>
      &#8592;
    </button>
  );
};

export default BackButton;