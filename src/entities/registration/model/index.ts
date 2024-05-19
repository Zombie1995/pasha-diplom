import { makeAutoObservable } from "mobx";

class RegistrationStore {
  password: string = "";
  checkPassword: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setPassword = (value: string) => {
    this.password = value;
  };

  setCheckPassword = (value: string) => {
    this.checkPassword = value;
  };
}

export const registrationStore = new RegistrationStore();
