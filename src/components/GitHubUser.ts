import createDataComponent from "./createDataComponent";
import { GITHUB_API_URL, MESSAGE_USE_DATA_OR_CONTENT_PROP } from "@/constants";

interface IUserProps {
  user: string;
  data?: "followers" | "following";
}

interface IUserData {
  followers: number;
  following: number;
}

interface IUserResponse {
  followers: number;
  following: number;
}

const GitHubUser = createDataComponent<IUserProps, IUserData, IUserResponse>(
  "GitHubUser",
  (props: IUserProps) => GITHUB_API_URL + "/users/" + props.user,
  (props: IUserProps) => props.user,
  (props: IUserProps, data: IUserData) => {
    switch (props.data) {
      case "followers":
        return data.followers;
      case "following":
        return data.following;
      default:
        return MESSAGE_USE_DATA_OR_CONTENT_PROP;
    }
  },
  ({ followers, following }) => ({
    followers,
    following,
  })
);

export default GitHubUser;
