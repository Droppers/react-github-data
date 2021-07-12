export const api = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    return response.text().then((text) => {
      throw Error(text);
    });
  } else {
    return response.json() as Promise<T>;
  }
};
