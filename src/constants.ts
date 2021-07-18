export const STORAGE_AGE_MINUTES = 60;
export const STORAGE_PREFIX = "ReactGitHub_";

export const CLASS_NAME_PREFIX = "gh";

export const GITHUB_API_URL = "https://api.github.com";
export const MESSAGE_USE_DATA_OR_CONTENT_PROP =
  'Use either the "data" or "content" prop to display GitHub data.';

export const invalidDataProp = (properties: string[]): string => {
  return `Invalid "data" prop value, use one of the following values: "${properties.join(
    ","
  )}"`;
};
