import React from 'react';
import './Button.scss';
import { ButtonProps } from "../../types/types"

export const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", disabled, kind = "primary" }) => {
  return (
    <button
      className={`button button--${kind}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};