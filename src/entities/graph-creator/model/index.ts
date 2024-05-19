import { makeAutoObservable } from "mobx";

class GraphCreatorStore {
  link: string = "";
  model: string = "russian_news";

  constructor() {
    makeAutoObservable(this);
  }

  setLink = (link: string) => {
    this.link = link;
  };

  setModel = (model: string) => {
    this.model = model;
  };
}

export const graphCreatorStore = new GraphCreatorStore();
