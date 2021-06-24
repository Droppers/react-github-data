import React from "react";
import { createStore } from "react-hooks-global-state";
import { STORAGE_PREFIX } from "../constants";
import { FetchingState } from "../types/enums";
import { IGitHubData } from "../types/types";

interface GitHubState {
    dispatch: (action: Action) => Action,
    useGitHubState: <StateKey extends keyof IRepoState>(stateKey: StateKey) => readonly [IRepoState[StateKey], (u: React.SetStateAction<IRepoState[StateKey]>) => void]
}

interface IRepoState {
    fetching: { [key: string]: FetchingState; };
    data: { [key: string]: IGitHubData; };
}

type Action =
    | { type: "setFetching"; identifier: string; fetching: FetchingState }
    | { type: "setData"; identifier: string; data: IGitHubData; };

const getDefaultState = (key: string, cacheAgeMinutes: number): IRepoState => {
    const fetching = {};
    const data = {};
    const existingDataValue = localStorage.getItem(STORAGE_PREFIX + key);
    if (existingDataValue !== null) {
        const now = new Date();

        const existingData: Map<string, IGitHubData> = new Map(Object.entries(JSON.parse(existingDataValue)));
        existingData.forEach((value: IGitHubData, identifier: string) => {
            const age = (Math.abs(+now - +new Date(value.fetchedAt ?? "")) / 1000) / 60;
            fetching[identifier] = age > cacheAgeMinutes ? FetchingState.Invalidate : FetchingState.Loaded;
            data[identifier] = value;
        });
    }

    return {
        fetching: fetching,
        data: data
    }
};

const saveToLocalStorage = (key: string, data: { [key: string]: IGitHubData; }) => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
};

const reducer: React.Reducer<IRepoState, Action> = (state: IRepoState, action: Action) => {
    switch (action.type) {
        case "setFetching":
            return {
                ...state,
                fetching: {
                    ...state.fetching,
                    [action.identifier]: action.fetching
                },
            };
        case "setData":
            return {
                fetching: {
                    ...state.fetching,
                    [action.identifier]: FetchingState.Loaded
                },
                data: {
                    ...state.data,
                    [action.identifier]: action.data
                },
            };
        default: return state;
    }
};

const createGitHubState = (key: string, cacheAgeMinutes: number): GitHubState => {
    const { dispatch, useGlobalState } = createStore(
        (state: IRepoState, action: Action) => {
            const newState = reducer(state, action);

            if (action.type === "setData") {
                saveToLocalStorage(key, newState.data);
            }

            return newState;
        },
        getDefaultState(key, cacheAgeMinutes),
    );
    return { dispatch, useGitHubState: useGlobalState };
};

export default createGitHubState;