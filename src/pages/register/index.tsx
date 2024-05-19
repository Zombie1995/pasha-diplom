import { RegisterCard } from "widgets/register-card";

export default function Register() {
  return (
    <div className="h-[100svh] flex flex-col items-center justify-center">
      <div className="-translate-y-10">
        <RegisterCard />
      </div>
    </div>
  );
}
