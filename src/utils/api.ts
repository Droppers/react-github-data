export const api = <T>(url: string): Promise<T> => {
    return fetch(url).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw Error(text)
            });
        } else {
            return response.json() as Promise<T>;
        }
    });
};