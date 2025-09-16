import React, { FC } from 'react';
import './RegistrationSuccessModal.scss';
import { RegistrationSuccessModalProps } from '../../types/types'


const RegistrationSuccessModal: FC<RegistrationSuccessModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    <div className="registration-success-modal-overlay" onClick={onClose}>
      <div className="registration-success-modal__content" onClick={(e) => e.stopPropagation()}>
        <h2 className="registration-success-modal__title">Регистрация завершена</h2>
        <p className="registration-success-modal__message">Используйте вашу электронную почту для входа</p>
        <button
          className="registration-success-modal__login-button"
          onClick={onLoginClick}
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;