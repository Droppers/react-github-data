import { loadData, saveData } from "./storage";

beforeEach(() => {
  window.localStorage.setItem(
    "object",
    JSON.stringify({ key1: "value1", key2: "value2" })
  );
  window.localStorage.setItem("invalid", '["": ""]');
  window.localStorage.removeItem("save");
});

describe("'storage' tests", () => {
  test("'saveData()' can save", () => {
    saveData("save", { test: "test" });
    expect(window.localStorage.getItem("save")).toBe('{"test":"test"}');
  });

  test("'saveData()' can save a map as object", () => {
    const map = new Map<string, string>();
    map.set("test", "test");
    saveData("save", map);
    expect(window.localStorage.getItem("save")).toBe('{"test":"test"}');
  });

  test("'loadData()' invalid returns null", () => {
    const data = loadData<unknown>("invalid");
    expect(data).toBeNull();
  });

  test("'loadData()' can load", () => {
    const data = loadData<unknown>("object");
    expect(data).toStrictEqual({ key1: "value1", key2: "value2" });
  });

  test("'loadData()' can load as Map", () => {
    const data = loadData<Map<string, string>>("object", Map);
    expect(data).toBeInstanceOf(Map);
    expect(data.get("key1")).toBe("value1");
  });
});
