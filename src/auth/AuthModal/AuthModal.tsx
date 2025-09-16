// src/auth/AuthModal/AuthModal.tsx
import React, { useState, useCallback } from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import RegistrationSuccessModal from '../RegistrationSuccessModal/RegistrationSuccessModal';
import { registerUser, loginUser } from '../../api/apiClient';
import './AuthModal.scss';
import { AuthModalProps, RegisterFormProps, RegisterFormData, LoginFormProps, LoginFormData, User, AuthType } from "../../types/types";
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

interface AuthApiResponse {
  result: boolean;
  user?: User;
  message?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authType, setAuthType] = useState<AuthType>('login');
  const [showRegComplete, setShowRegComplete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const loginMutationOptions: UseMutationOptions<AuthApiResponse, Error, LoginFormData, unknown> = {
    mutationFn: (loginData: LoginFormData) => loginUser(loginData),
    onSuccess: (data) => {
      if (data.result && data.user) {
        onAuthSuccess(data.user);
        onClose();
        queryClient.invalidateQueries({ queryKey: ['user'], exact: true }); 
      } else {
        handleApiError(data.message || 'Неверный email или пароль.');
      }
    },
    onError: (error: Error) => {
      handleApiError('Ошибка при логине. Попробуйте позже.');
      console.error('Login error:', error.message);
    },
  };
  const loginMutation = useMutation(loginMutationOptions);

  const registerMutationOptions: UseMutationOptions<AuthApiResponse, Error, RegisterFormData, unknown> = {
    mutationFn: (registerData: RegisterFormData) => registerUser(registerData),
    onSuccess: (data) => {
      if (data.result && data.user) {
        setShowRegComplete(true);
        queryClient.invalidateQueries({ queryKey: ['user'], exact: true }); 
      } else {
        handleApiError(data.message || 'Ошибка при регистрации.');
      }
    },
    onError: (error: Error) => {
      handleApiError('Ошибка при регистрации.');
      console.error('Register error:', error.message);
    },
  };
  const registerMutation = useMutation(registerMutationOptions);

  const handleToggleAuthType = useCallback((type: AuthType) => {
    setAuthType(type);
    setApiError(null);
  }, []);

  const handleApiError = useCallback((message: string) => {
    setApiError(message);
  }, []);

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (formData: RegisterFormData) => {
    registerMutation.mutate(formData);
  };

  const handleRegCompleteCloseAndLogin = useCallback(async () => {
    setShowRegComplete(false);
    setAuthType('login');
  }, []);

  const loginFormProps: LoginFormProps = {
    onSubmit: handleLogin,
    onToggleAuthType: handleToggleAuthType,
    isLoading: loginMutation.isPending,
  };

  const registerFormProps: RegisterFormProps = {
    onSubmit: handleRegister,
    onToggleAuthType: handleToggleAuthType,
    isLoading: registerMutation.isPending,
  };

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close-button" onClick={onClose}>
          <img src="/icons/icon-back-modal.svg"  alt="Закрыть" /> 
        </button>
        <div className="auth-modal__header">
          <img src="/icons/logo-icon-modal.svg" alt="Логотип" className="auth-modal__logo" /> 
        </div>
        {showRegComplete ? (
          <RegistrationSuccessModal
            isOpen={showRegComplete}
            onClose={handleRegCompleteCloseAndLogin}
            onLoginClick={handleRegCompleteCloseAndLogin}
          />
        ) : (
          <>
            {authType === 'login' ? (
              <LoginForm {...loginFormProps} />
            ) : (
              <RegisterForm {...registerFormProps} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
