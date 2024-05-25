import { makeAutoObservable, runInAction } from "mobx";
import { Comment } from "shared/ui/network-visualization";
import { CommentReddit } from "shared/ui/network-visualization-reddit";
import { getRedditGraph, getVKGraph } from "../api";

export type ModelType =
  | "russian_news"
  | "toxicity"
  | "lenta_news"
  | "simple"
  | "cyberbullying"
  | "without";

export type SocialType = "vk" | "reddit";

class GraphCreatorStore {
  link: string = "";
  model: ModelType = "russian_news";
  social: SocialType = "vk";
  // social: SocialType = "reddit";
  comments: Comment[] | CommentReddit[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLink = (link: string) => {
    this.link = link;
  };

  setModel = (model: ModelType) => {
    this.model = model;
  };

  setSocial = (social: SocialType) => {
    this.setModel(social === "vk" ? "russian_news" : "simple");
    this.social = social;
  };

  setComments = (comments: Comment[]) => {
    this.comments = comments;
  };

  loadComments = async () => {
    this.loading = true;
    try {
      // Fetch comments from an API or other data source
      let comments: any = [];
      if (this.social === "vk") {
        comments = await getVKGraph(this.link, this.model);
      } else {
        comments = await getRedditGraph(this.link, this.model);
      }
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
