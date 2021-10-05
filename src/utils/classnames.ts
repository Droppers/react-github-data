/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const classNames = (input: any | any[]): string => {
  if (typeof input === "function") {
    return input();
  } else if (typeof input === "string") {
    return input.trim();
  } else if (input) {
    return input
      .map((a: any) => classNames(a))
      .filter(Boolean)
      .join(" ");
  }

  return "";
};

export default classNames;
