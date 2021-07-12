import { STORAGE_PREFIX } from "@/constants";
import { DataState } from "@/types/enums";
import {
  loadFromStorage,
  removeFromStorage,
  saveToStorage,
} from "@/utils/storage";
import Subscribable from "./Subscribable";

interface IStoreEntry<T> {
  state: DataState;
  version?: number;
  fetchedAt?: Date;
  data?: T;
}

class DataStore<T> extends Subscribable<IStoreEntry<T>> {
  private _storageKey: string;
  private _maxStorageAge: number;
  private _version: number;
  private _entries: Map<string, IStoreEntry<T>> = new Map();

  private _localStorageLoaded = false;

  constructor(storageKey: string, maxCacheAge: number, version = 1) {
    super();
    this._storageKey = storageKey;
    this._maxStorageAge = maxCacheAge;
    this._version = version;
  }

  private loadLocalStorage() {
    this._localStorageLoaded = true;
    const existingData = loadFromStorage<Map<string, IStoreEntry<T>>>(
      STORAGE_PREFIX + this._storageKey,
      Map
    );
    if (existingData !== null) {
      const now = new Date();
      existingData.forEach((entry: IStoreEntry<T>, key: string) => {
        if (!entry.fetchedAt || this._version > (entry.version ?? 0)) return;

        const age = (+now - +new Date(entry.fetchedAt)) / 1000 / 60;
        entry.state =
          age > this._maxStorageAge ? DataState.Waiting : DataState.Fetched;

        this._entries.set(key, entry);
      });
    }
  }

  private saveLocalStorage() {
    const storage = {};
    this._entries.forEach((value: IStoreEntry<T>, key: string) => {
      if (value.data && Object.keys(value.data).length !== 0) {
        storage[key] = { ...value, version: this._version };
      }
    });

    if (Object.keys(storage).length !== 0) {
      saveToStorage(STORAGE_PREFIX + this._storageKey, storage);
    } else {
      removeFromStorage(STORAGE_PREFIX + this._storageKey);
    }
  }

  public setState(key: string, state: DataState): IStoreEntry<T> {
    const entry = this.get(key) || {};
    entry.state = state;
    return this.set(key, entry);
  }

  public setData(key: string, data: T): IStoreEntry<T> {
    const entry = this.get(key) || {};
    entry.state = DataState.Fetched;
    entry.fetchedAt = new Date();
    entry.data = data;
    return this.set(key, entry);
  }

  private set(key: string, entry: IStoreEntry<T>): IStoreEntry<T> {
    this._entries.set(key, entry);
    this.invoke(key, entry);

    this.saveLocalStorage();
    return entry;
  }

  public get(key: string): IStoreEntry<T> {
    if (!this._localStorageLoaded) {
      this.loadLocalStorage();
    }

    if (this._entries.has(key)) {
      return this._entries.get(key) as IStoreEntry<T>;
    }

    const entry = {
      state: DataState.Waiting,
    };
    this._entries.set(key, entry);
    return entry;
  }

  public isWaiting(key: string): boolean {
    const entry = this.get(key);

    if (entry.state === DataState.Waiting) {
      entry.state = DataState.Fetching;
      return true;
    }
    return false;
  }
}

export default DataStore;
