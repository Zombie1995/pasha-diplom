import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LoginField } from "shared/ui/login-field";

export const LoginCard = () => {
  const navigate = useNavigate();

  const handleEnter = useCallback(() => {
    navigate("/graph");
  }, [navigate]);

  return (
    <div className="min-w-[450px] bg-white rounded-[20px] outline outline-[1.5px] outline-[#949cb8] p-[30px] pb-[40px] flex flex-col items-center">
      <p className="text-[30px] font-medium text-center">Вход в систему</p>
      <div className="h-[18px]" />
      <LoginField title="Логин" />
      <div className="h-[18px]" />
      <LoginField title="Пароль" type="password" />
      <div className="h-[34px]" />
      <div className="relative w-full">
        <button
          className="bg-blue-500 min-h-[50px] w-full text-white text-[18px] rounded-[5px]"
          onClick={handleEnter}
        >
          Войти
        </button>
        <a href="/register">
          <button className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[14px]">
            Регистрация
          </button>
        </a>
      </div>
    </div>
  );
};
