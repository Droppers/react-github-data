import classNames from "./classnames";

const testCases = test.each([
  ["test", "test"],
  [null, ""],
  [undefined, ""],
  [() => "test", "test"],
  [[" test ", " second "], "test second"],
  [["test", ["nested", "nested2"], " second"], "test nested nested2 second"],
  [
    ["test", [() => "nested", "nested2"], null, " second"],
    "test nested nested2 second",
  ],
]);

describe("'classNames' tests", () => {
  testCases("input %p expects result '%s'", (input, result) => {
    expect(classNames(input)).toBe(result);
  });
});
