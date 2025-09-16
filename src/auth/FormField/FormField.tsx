import React from 'react';
import './FormField.scss';
import { FormFieldProps } from "../../types/types"

export const FormField: React.FC<FormFieldProps> = ({ label, icon, error, children, isInvalid }) => { 
  return (
    <div className="form-field">
      <label className="form-field__label">
        {icon && <img src={icon} alt="Icon" className={`form-field__icon ${isInvalid ? 'is-invalid' : ''}`} />} 
        {label}
      </label>
      <div className="form-field__input-wrapper">
        {children}
      </div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};