import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { RegisterFormProps } from "../../types/types";
import { FormField } from "../FormField/FormField";
import { Button } from "../Button/Button";
import "./RegisterForm.scss";

const schema = yup.object({
  name: yup.string().required("Обязательное поле"),
  surname: yup.string().required("Обязательное поле"),
  email: yup.string().email("Неверный формат email").required("Обязательное поле"),
  password: yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password")], "Пароли должны совпадать")
    .required("Обязательное поле"),
}).required();

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onToggleAuthType, onLoginClick, isLoading  }) => {
  const { register, handleSubmit, formState: { errors, isValid }, } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const onSubmitHandler = (data: any) => {
    onSubmit({
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
    });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmitHandler)}>
      <FormField label="Имя" icon="/icons/icon-people.svg">
        <input
          type="text"
          placeholder="Имя"
          {...register("name")}
          disabled={isLoading}
          className={errors.name ? 'is-invalid' : ''}
        />
        {errors.name && <span className="error"></span>}
      </FormField>
      <FormField label="Фамилия" icon="icons/icon-people.svg">
        <input
          type="text"
          placeholder="Фамилия"
          {...register("surname")}
          disabled={isLoading}
          className={errors.surname ? 'is-invalid' : ''}
        />
        {errors.surname && <span className="error"></span>}
      </FormField>
      <FormField label="Электронная почта" icon="/icons/icon-mail.svg">
        <input
          type="email"
          placeholder="Электронная почта"
          {...register("email")}
          className={errors.email ? 'is-invalid' : ''}
        />
        {errors.email && <span className="error"></span>}
      </FormField>
      <FormField label="Пароль" icon="/icons/icon-password.svg">
        <input
          type="password"
          placeholder="Пароль"
          {...register("password")}
          disabled={isLoading}
          className={errors.password ? 'is-invalid' : ''}
        />
        {errors.password && <span className="error"></span>}
      </FormField>
      <FormField label="Подтвердите пароль" icon="/icons/icon-password.svg">
        <input
          type="password"
          placeholder="Подтвердите пароль"
          {...register("confirmPassword")}
          disabled={isLoading}
          className={errors.confirmPassword ? 'is-invalid' : ''}
        />
        {errors.confirmPassword && <span className="error"></span>}
      </FormField>
      <Button
        kind="primary"
        type="submit"
        disabled={!isValid || isLoading} 
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
      <div className="register-form__toggle-auth" onClick={() => onToggleAuthType?.('login')}>
        У меня есть пароль
      </div>
    </form>
  );
};

export default RegisterForm;