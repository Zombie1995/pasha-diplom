import { LoginCard } from "widgets/login-card";

export default function Login() {
  return (
    <div className="h-[100svh] w-[100svw] flex items-center justify-center">
      <div className="-translate-y-10">
        <LoginCard />
      </div>
    </div>
  );
}
