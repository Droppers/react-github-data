import { GITHUB_API_URL, MESSAGE_USE_DATA_OR_CONTENT_PROP } from "@/constants";
import createDataComponent from "./createDataComponent";

interface IRepoProps {
  user: string;
  repo: string;
  data?: "name" | "description" | "language" | "stars" | "watchers" | "forks";
}

interface IRepoData {
  name: string;
  description: string;
  language: string;
  stars: number;
  watchers: number;
  forks: number;
}

interface IRepoResponse {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  subscribers_count: number;
  forks: number;
}

const GitHubRepo = createDataComponent<IRepoProps, IRepoData, IRepoResponse>(
  "GitHubRepo",
  (props: IRepoProps) =>
    GITHUB_API_URL + "/repos/" + props.user + "/" + props.repo,
  (props: IRepoProps) => props.user + "/" + props.repo,
  (props: IRepoProps, data: IRepoData) => {
    switch (props.data) {
      case "name":
        return data.name;
      case "description":
        return data.description;
      case "language":
        return data.language;
      case "stars":
        return data.stars;
      case "watchers":
        return data.watchers;
      case "forks":
        return data.forks;
      default:
        return MESSAGE_USE_DATA_OR_CONTENT_PROP;
    }
  },
  ({
    name,
    description,
    language,
    stargazers_count,
    subscribers_count,
    forks,
  }) => ({
    name,
    description,
    language,
    stars: stargazers_count,
    watchers: subscribers_count,
    forks,
  })
);

export default GitHubRepo;
