import {
  CLASS_NAME_PREFIX,
  GITHUB_API_URL,
  invalidDataProp,
  MESSAGE_USE_DATA_OR_CONTENT_PROP,
} from "@/constants";
import createDataComponent from "./createDataComponent";

const COMPONENT_VERSION = 1;

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

const PROPERTIES = [
  "name",
  "description",
  "language",
  "stars",
  "watchers",
  "forks",
];

const GitHubRepo = createDataComponent<IRepoProps, IRepoData, IRepoResponse>(
  COMPONENT_VERSION,
  "GitHubRepo",
  CLASS_NAME_PREFIX,
  (props: IRepoProps) =>
    GITHUB_API_URL + "/repos/" + props.user + "/" + props.repo,
  (props: IRepoProps) => props.user + "/" + props.repo,
  (props: IRepoProps, data: IRepoData) => {
    if (!props.data) {
      return MESSAGE_USE_DATA_OR_CONTENT_PROP;
    } else if (props.data in PROPERTIES) {
      return data[props.data];
    } else {
      return invalidDataProp(PROPERTIES);
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
