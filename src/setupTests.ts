/* eslint-disable @typescript-eslint/no-explicit-any */
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

class LocalStorageMock {
  private _store = {};

  get length(): number {
    return Object.keys(this._store).length;
  }

  getItem(key: string): any {
    return this._store[key] || null;
  }

  setItem(key: string, value: any) {
    this._store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this._store[key];
  }

  clear() {
    this._store = {};
  }
}

beforeAll(() => {
  const mockLocalStorage = new LocalStorageMock();
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
  });
});

beforeEach(() => {
  localStorage.clear();
});

configure({ adapter: new Adapter() });
