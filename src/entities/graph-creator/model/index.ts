import { makeAutoObservable, runInAction } from "mobx";
import { Comment } from "shared/ui/network-visualization";
import { getGraph } from "../api";

class GraphCreatorStore {
  link: string = "";
  model: string = "russian_news";
  comments: Comment[] = [];
  loading: boolean = false;

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

  loadComments = async () => {
    this.loading = true;
    try {
      // Fetch comments from an API or other data source
      const comments = await getGraph(this.link, this.model);
      runInAction(() => {
        this.setComments(comments ? comments : []);
      });
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      console.log(this.comments);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

export const graphCreatorStore = new GraphCreatorStore();
