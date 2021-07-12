import { STORAGE_PREFIX } from "@/constants";
import { DataState } from "@/types/enums";
import { loadData, removeData, saveData } from "@/utils/storage";
import Subscribable from "./Subscribable";

interface IStoreEntry<T> {
  state: DataState;
  fetchedAt?: Date;
  data?: T;
}

class DataStore<T> extends Subscribable<IStoreEntry<T>> {
  private _storageKey: string;
  private _maxStorageAge: number;
  private _data: Map<string, IStoreEntry<T>> = new Map();

  private _localStorageLoaded = false;

  constructor(storageKey: string, maxCacheAge: number) {
    super();
    this._storageKey = storageKey;
    this._maxStorageAge = maxCacheAge;
  }

  private loadLocalStorage() {
    this._localStorageLoaded = true;
    const existingData = loadData<Map<string, IStoreEntry<T>>>(
      STORAGE_PREFIX + this._storageKey,
      Map
    );
    if (existingData !== null) {
      const now = new Date();
      existingData.forEach((entry: IStoreEntry<T>) => {
        if (!entry.fetchedAt) return;

        const age = (+now - +new Date(entry.fetchedAt)) / 1000 / 60;
        entry.state =
          age > this._maxStorageAge ? DataState.Waiting : DataState.Fetched;
      });

      this._data = existingData;
    }
  }

  private saveLocalStorage() {
    const storage = {};
    this._data.forEach((value: IStoreEntry<T>, key: string) => {
      if (value.data && Object.keys(value.data).length !== 0) {
        storage[key] = value;
      }
    });

    if (Object.keys(storage).length !== 0) {
      saveData(STORAGE_PREFIX + this._storageKey, storage);
    } else {
      removeData(STORAGE_PREFIX + this._storageKey);
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
    this._data.set(key, entry);
    this.invoke(key, entry);

    this.saveLocalStorage();
    return entry;
  }

  public get(key: string): IStoreEntry<T> {
    if (!this._localStorageLoaded) {
      this.loadLocalStorage();
    }

    if (this._data.has(key)) {
      return this._data.get(key) as IStoreEntry<T>;
    }

    const entry = {
      state: DataState.Waiting,
    };
    this._data.set(key, entry);
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
