import createGitHubComponent from "./base/createGitHubComponent";
import { GITHUB_API_URL } from "../constants";
import { IGitHubData, IProps } from "../types/types";

interface IRepoProps extends IProps {
    user: string;
    repo: string;
    type: "description" | "language" | "stars" | "watchers" | "forks";
}

interface IRepoData extends IGitHubData {
    description: string;
    language: string;
    stars: number;
    watchers: number;
    forks: number;
}

const GitHubRepo = createGitHubComponent<
    IRepoProps,
    IRepoData,
    { description: string; language: string; stargazers_count: number; subscribers_count: number; forks: number; }
>(
    "GitHubRepo",
    (props: IRepoProps) => GITHUB_API_URL + "/repos/" + props.user + "/" + props.repo,
    (props: IRepoProps) => props.user + "/" + props.repo,
    (props: IRepoProps, data: IRepoData) => {
        switch (props.type) {
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
        }
    },
    ({ description, language, stargazers_count, subscribers_count, forks }) => ({
        description: description,
        language: language,
        stars: stargazers_count,
        watchers: subscribers_count,
        forks: forks
    }));

export default GitHubRepo;