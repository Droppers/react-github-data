import createGitHubComponent from "./base/createGitHubComponent";
import { GITHUB_API_URL } from "../constants";
import { IGitHubData, IProps } from "../types/types";

interface IUserProps extends IProps {
    user: string;
    type: "followers" | "following";
}

interface IUserData extends IGitHubData {
    followers: number;
    following: number;
}

const GitHubUser = createGitHubComponent<
    IUserProps,
    IUserData,
    { followers: number; following: number; }
>(
    "GitHubUser",
    (props: IUserProps) => GITHUB_API_URL + "/users/" + props.user,
    (props: IUserProps) => props.user,
    (props: IUserProps, data: IUserData) => {
        switch (props.type) {
            case "followers":
                return data.followers;
            case "following":
                return data.following;
        }
    },
    ({ followers, following }) => ({
        followers,
        following
    }));

export default GitHubUser;