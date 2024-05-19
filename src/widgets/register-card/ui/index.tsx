import { registrationStore } from "entities/registration/model";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginField } from "shared/ui/login-field";

export const RegisterCard = observer(() => {
  const navigate = useNavigate();
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handlePasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordMismatch(false);
      registrationStore.setPassword(event.target.value);
    },
    []
  );
  const handleCheckPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordMismatch(false);
      registrationStore.setCheckPassword(event.target.value);
    },
    []
  );
  const handleRegister = useCallback(() => {
    if (registrationStore.password !== registrationStore.checkPassword) {
      setPasswordMismatch(true);
    } else {
      navigate("/graph");
    }
  }, [navigate]);

  return (
    <div className="min-w-[450px] bg-white rounded-[20px] outline outline-[1.5px] outline-[#949cb8] p-[30px] pb-[40px] flex flex-col items-center">
      <p className="text-[30px] font-medium text-center">Регистрация</p>
      <div className="h-[18px]" />
      <LoginField title="Логин" />
      <div className="h-[18px]" />
      <LoginField title="e-mail" />
      <div className="h-[18px]" />
      <LoginField
        title="Пароль"
        type="password"
        onChange={handlePasswordChange}
      />
      <div className="h-[18px]" />
      <div className="relative w-full">
        <LoginField
          title="Повторите пароль"
          type="password"
          onChange={handleCheckPasswordChange}
          wrong={passwordMismatch}
          wrongText="Пароли не совпадают"
        />
      </div>
      <div className="h-[34px]" />
      <div className="relative w-full">
        <button
          className="bg-blue-500 min-h-[50px] w-full text-white text-[18px] rounded-[5px]"
          onClick={handleRegister}
        >
          Зарегистрироваться
        </button>
        <a href="/login">
          <button className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[14px]">
            Вход
          </button>
        </a>
      </div>
    </div>
  );
});
