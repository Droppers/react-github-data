import { STORAGE_PREFIX } from "@/constants";
import { DataState } from "@/types/enums";
import DataStore from "./DataStore";

describe("'DataStore' tests", () => {
  const key = "testkey";
  const identifier = "Droppers/AnimatedBottomBar";
  const identifier2 = "Droppers/RandomGarbage";
  let store: DataStore<string>;

  beforeEach(() => {
    store = new DataStore(key, 60);
  });

  describe("LocalStorage tests", () => {
    test("loading cache from LocalStorage", () => {
      localStorage.setItem(
        STORAGE_PREFIX + key,
        JSON.stringify({
          [identifier]: {
            state: DataState.Fetched,
            fetchedAt: "2021-07-06T18:01:35.521Z", // Older than 60 minutes
            data: "jup",
          },
          [identifier2]: {
            state: DataState.Fetched,
            fetchedAt: new Date(new Date().getTime() + 86400000), // Newer than current date
            data: "jup",
          },
        })
      );

      expect(store.get(identifier).state).toBe(DataState.Waiting);
      expect(store.get(identifier).data).toBe("jup");
      expect(store.get(identifier2).state).toBe(DataState.Fetched);
    });

    test("test if data is stored", () => {
      const entry = store.setData(identifier, "hihi");
      expect(window.localStorage.length).toBe(1);
      expect(
        JSON.parse(window.localStorage.getItem(STORAGE_PREFIX + key))
      ).toStrictEqual({
        "Droppers/AnimatedBottomBar": {
          state: DataState.Fetched,
          fetchedAt: entry.fetchedAt.toJSON(), // Older than 60 minutes
          data: "hihi",
        },
      });
    });

    test("test if data is only stored if data has a value", () => {
      store.setData(identifier, "test");
      expect(window.localStorage.length).toBe(1);

      store.setData(identifier, null);
      expect(window.localStorage.length).toBe(0);
    });
  });

  test("'setState()' stores the state", () => {
    store.setState(identifier, DataState.Error);
    expect(store.get(identifier).state).toBe(DataState.Error);
  });

  test("'setData()' stores the data", () => {
    store.setData(identifier, "test data");
    expect(store.get(identifier).state).toBe(DataState.Fetched);
    expect(store.get(identifier).fetchedAt).not.toBeUndefined();
    expect(store.get(identifier).data).toBe("test data");
  });

  test("'get()' returns state waiting if not exists", () => {
    expect(store.get(identifier).state).toBe(DataState.Waiting);
  });

  test("'isWaiting()' only returns true once", () => {
    expect(store.isWaiting(identifier)).toBe(true);
    expect(store.isWaiting(identifier)).toBe(false);
  });
});
