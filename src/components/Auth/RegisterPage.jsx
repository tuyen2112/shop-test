import { useNotification } from '../../contexts/NotificationContext';

const RegisterPage = () => {
  const showNotification = useNotification();
  
  const handleRegister = async (userData) => {
    try {
      // ... register logic
      if (response.ok) {
        showNotification.registerSuccess();
        navigate('/login');
      }
    } catch (error) {
      showNotification.error(error.message);
    }
  };
  
  // ... rest of the code
}; 