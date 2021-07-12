import { loadFromStorage, saveToStorage } from "./storage";

beforeEach(() => {
  window.localStorage.setItem(
    "object",
    JSON.stringify({ key1: "value1", key2: "value2" })
  );
  window.localStorage.setItem("invalid", '["": ""]');
  window.localStorage.removeItem("save");
});

describe("'storage' tests", () => {
  describe("'saveToStorage()'", () => {
    test("can save", () => {
      saveToStorage("save", { test: "test" });
      expect(window.localStorage.getItem("save")).toBe('{"test":"test"}');
    });

    test("can save a map as object", () => {
      const map = new Map<string, string>();
      map.set("test", "test");
      saveToStorage("save", map);
      expect(window.localStorage.getItem("save")).toBe('{"test":"test"}');
    });
  });

  describe("'loadFromStorage()'", () => {
    test("invalid returns null", () => {
      const data = loadFromStorage<unknown>("invalid");
      expect(data).toBeNull();
    });

    test("can load", () => {
      const data = loadFromStorage<unknown>("object");
      expect(data).toStrictEqual({ key1: "value1", key2: "value2" });
    });

    test("can load as Map", () => {
      const data = loadFromStorage<Map<string, string>>("object", Map);
      expect(data).toBeInstanceOf(Map);
      expect(data.get("key1")).toBe("value1");
    });
  });
});
