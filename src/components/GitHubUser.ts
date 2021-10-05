import createDataComponent from "./createDataComponent";
import {
  CLASS_NAME_PREFIX,
  GITHUB_API_URL,
  invalidDataProp,
  MESSAGE_USE_DATA_OR_CONTENT_PROP,
} from "@/constants";

const COMPONENT_VERSION = 1;

interface IUserProps {
  user: string;
  data?:
    | "avatar"
    | "username"
    | "name"
    | "bio"
    | "website"
    | "location"
    | "followers"
    | "following";
}

interface IUserData {
  avatar: string;
  username: string;
  name: string;
  bio: string;
  website: string;
  location: string;
  followers: number;
  following: number;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  name: string;
  bio: string;
  blog: string;
  location: string;
  followers: number;
  following: number;
}

const PROPERTIES = [
  "avatar",
  "username",
  "name",
  "bio",
  "website",
  "location",
  "followers",
  "following",
];

const GitHubUser = createDataComponent<IUserProps, IUserData, IUserResponse>(
  COMPONENT_VERSION,
  "GitHubUser",
  CLASS_NAME_PREFIX,
  (props: IUserProps) => GITHUB_API_URL + "/users/" + props.user,
  (props: IUserProps) => props.user,
  (props: IUserProps, data: IUserData) => {
    if (!props.data) {
      return MESSAGE_USE_DATA_OR_CONTENT_PROP;
    } else if (PROPERTIES.indexOf(props.data) !== -1) {
      return data[props.data];
    } else {
      return invalidDataProp(PROPERTIES);
    }
  },
  ({ avatar_url, login, name, bio, blog, location, followers, following }) => ({
    avatar: avatar_url,
    username: login,
    name,
    bio,
    website: blog,
    location,
    followers,
    following,
  })
);

export default GitHubUser;
