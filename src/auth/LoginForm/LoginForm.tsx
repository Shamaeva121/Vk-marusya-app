import React, { useState, FC } from 'react';
import "./LoginForm.scss";
import { FormField } from "../FormField/FormField";
import { Button } from "../Button/Button";
import { LoginFormProps } from "../../types/types";

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, onToggleAuthType, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <FormField label="Электронная почта" icon="/icons/icon-mail.svg">
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Пароль" icon="/icons/icon-password.svg">
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormField>

      <Button kind="primary" type="submit" disabled={isLoading}>
        Войти
      </Button>

      <div className="login-form__toggle-auth" onClick={() => onToggleAuthType('register')}>
        Регистрация
      </div>
    </form>
  );
};