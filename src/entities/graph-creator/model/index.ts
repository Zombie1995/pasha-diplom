import { makeAutoObservable } from "mobx";
import { Comment } from "shared/ui/network-visualization";

class GraphCreatorStore {
  link: string = "";
  model: string = "russian_news";
  comments: Comment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLink = (link: string) => {
    this.link = link;
  };

  setModel = (model: string) => {
    this.model = model;
  };

  setComments = (comments: Comment[]) => {
    this.comments = comments;
  };
}

export const graphCreatorStore = new GraphCreatorStore();
