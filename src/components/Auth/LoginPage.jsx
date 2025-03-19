import { useNotification } from '../../contexts/NotificationContext';

const LoginPage = () => {
  const showNotification = useNotification();
  
  const handleLogin = async (credentials) => {
    try {
      // ... login logic
      if (response.ok) {
        showNotification.loginSuccess(credentials.username);
        navigate('/');
      }
    } catch (error) {
      showNotification.error(error.message);
    }
  };
  
  // ... rest of the code
}; 