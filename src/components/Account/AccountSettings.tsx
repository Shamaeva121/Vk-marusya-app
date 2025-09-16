import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/types'; 
import { fetchProfile } from '../../api/apiClient'
import './AccountSettings.scss'; 

interface AccountSettingsProps {
  user: User | null; 
  onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

   const handleLogoutClick = async () => { 
    try {
      await fetchProfile(); 

      onLogout();
      navigate("/");
    } catch (error) {
    }
  };

  const getInitials = (firstName: string | undefined, lastName: string | undefined): string => {
    if (!firstName || !lastName) {
      return ""; 
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="account-settings"> 
      <div className="account-settings__profile"> 
        <div className="account-settings__avatar">
          {getInitials(user.name, user.surname)}
        </div>
        <div className="account-settings__info">
          <div className="account-settings__name">{user.name} {user.surname}</div>
          <div className="account-settings__email">{user.email}</div>
        </div>
      </div>

      <button className="header__logout-button" onClick={handleLogoutClick}>Выйти из аккаунта</button>
    </div>
  );
};

export default AccountSettings;