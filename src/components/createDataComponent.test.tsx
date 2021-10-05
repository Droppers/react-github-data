/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { mount } from "enzyme";
import fetchMock from "jest-fetch-mock";
import { act } from "react-dom/test-utils";

import createDataComponent from "./createDataComponent";

const FAKE_URL = "http://fake.com/api";

interface IFakeProps {
  identifier: string;
}

interface IFakeData {
  forks: number;
  stars: number;
}

const FakeDataComponent = createDataComponent<
  IFakeProps,
  IFakeData,
  {
    stars: number;
    forks: number;
  }
>(
  1,
  "GitHubRepo",
  "test",
  (props: IFakeProps) => FAKE_URL + "/" + props.identifier,
  (props: IFakeProps) => props.identifier,
  (_props: IFakeProps, data: IFakeData) => {
    return data.forks;
  },
  ({ stars, forks }) => ({
    stars,
    forks,
  })
);

const wait = async (time: number) => new Promise((r) => setTimeout(r, time));

const IDENTIFIER_ONE = "identifier-one";
const IDENTIFIER_TWO = "identifier-two";
const IDENTIFIER_ZERO = "identifier-zero";

// I had to wrap everything in act() for React to not complain, I am not sure why.
describe("'createDataComponent()' tests", () => {
  beforeEach(() => {
    fetchMock.mockResponse(async (req) => {
      if (req.url.endsWith(IDENTIFIER_ONE)) {
        return JSON.stringify({
          forks: 123,
          starts: 321,
        });
      } else if (req.url.endsWith(IDENTIFIER_TWO)) {
        return JSON.stringify({
          forks: 999,
          starts: 777,
        });
      } else if (req.url.endsWith(IDENTIFIER_ZERO)) {
        return JSON.stringify({
          forks: 0,
          starts: 0,
        });
      } else {
        return {
          status: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }
    });
  });

  test("renders data", async () => {
    await act(async () => {
      const wrapper = mount(<FakeDataComponent identifier={IDENTIFIER_ONE} />);
      await wait(100);
      expect(wrapper.text()).toBe("123");
    });
  });

  test("renders data if zero", async () => {
    await act(async () => {
      const wrapper = mount(<FakeDataComponent identifier={IDENTIFIER_ZERO} />);
      await wait(100);
      expect(wrapper.text()).toBe("0");
    });
  });

  test("renders data for new props", async () => {
    await act(async () => {
      const wrapper = mount(<FakeDataComponent identifier={IDENTIFIER_ONE} />);
      await wait(100);
      expect(wrapper.text()).toBe("123");
      wrapper.setProps({ identifier: IDENTIFIER_TWO });
      await wait(100);
      expect(wrapper.text()).toBe("999");
    });
  });

  describe("callbacks", () => {
    test("onDataLoad is called", async () => {
      return new Promise<void>(async (resolve) => {
        await act(async () => {
          mount(
            <FakeDataComponent
              identifier={IDENTIFIER_ONE}
              onDataLoad={() => {
                resolve();
              }}
            />
          );
        });
      });
    }, 300);

    test("onDataError is called", async () => {
      return new Promise<void>(async (resolve) => {
        await act(async () => {
          const spy = jest.spyOn(console, "error").mockImplementation();
          mount(
            <FakeDataComponent
              identifier="haha-i-dont-exist"
              onDataError={() => {
                expect(spy).toBeCalledTimes(1);
                spy.mockRestore();
                resolve();
              }}
            />
          );
        });
      });
    }, 300);
  });
});
