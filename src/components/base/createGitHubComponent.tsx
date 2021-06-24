import React, { useEffect } from "react";
import classNames from "classnames";
import { FetchingState } from "../../types/enums";
import { IGitHubData, IProps } from "../../types/types";
import { api } from "../../utils/api";
import createGitHubState from "../../state/createGitHubState";
import { STORAGE_AGE_MINUTES } from "../../constants";

const getClasses = (name: string, fetchingState: FetchingState, initialClass: (string | undefined)): (string)[] => {
    const classes: string[] = [`github-${name}`];
    if (initialClass) {
        classes.push(initialClass);
    }
    switch (fetchingState) {
        case FetchingState.Loading:
            classes.push("github-loading")
            break;
        case FetchingState.Loaded:
            classes.push("github-loaded")
            break;
        case FetchingState.Error:
            classes.push("github-error")
            break;
    }
    return classes;
};

const getContent = (
    fetching: FetchingState,
    value: React.ReactElement | string | null,
    loading?: React.ReactElement | string,
    error?: React.ReactElement | string
): React.ReactElement | string => {
    if (value || (typeof value === "string" && value.length)) {
        return value;
    } else if (fetching === FetchingState.Loading && loading) {
        return loading;
    } else if (fetching === FetchingState.Error && error) {
        return error;
    }
    return "";
};

const defaultFormatter = (value: React.ReactElement | string | number): React.ReactElement | string => {
    if (typeof value === "number") {
        return value.toLocaleString();
    }

    return value;
};

const createGitHubComponent = <TProps extends IProps, TData extends IGitHubData, TRaw>(
    name: string,
    createDataUrl: (props: TProps) => string,
    createIdentifier: (props: TProps) => string,
    getValue: (props: TProps, data: TData) => React.ReactElement | string | number | null,
    mapRawData: (data: TRaw) => TData
): React.FC<TProps & React.HTMLAttributes<HTMLDivElement>> => {
    const className = (name.startsWith("GitHub") ? name.slice(6) : name).toLowerCase();
    const state = createGitHubState(name, STORAGE_AGE_MINUTES);

    const Component: React.FC<TProps & React.HTMLAttributes<HTMLDivElement>> = (props: TProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
        const [fetching] = state.useGitHubState("fetching");
        const [data] = state.useGitHubState("data");

        const identifier = createIdentifier(props);
        const fetchingState: FetchingState = fetching.hasOwnProperty(identifier) ? fetching[identifier] : FetchingState.Loading;
        const repoData: TData | null = fetching.hasOwnProperty(identifier) ? data[identifier] as TData : null;

        if (!fetching.hasOwnProperty(identifier) || fetchingState === FetchingState.Invalidate) {
            state.dispatch({
                type: "setFetching",
                identifier: identifier,
                fetching: FetchingState.Loading
            });

            api<TRaw>(createDataUrl(props))
                .then((data: TRaw): TData => mapRawData(data))
                .then((data: TData) => {
                    data.fetchedAt = new Date();
                    state.dispatch({
                        type: "setData",
                        identifier: identifier,
                        data
                    });
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((reason: Error) => {
                    console.error(`Could not load data for component ${name} (${identifier}):`, reason.message);
                    state.dispatch({
                        type: "setFetching",
                        identifier: identifier,
                        fetching: FetchingState.Error
                    });
                });
        }

        useEffect(() => {
            if (fetchingState === FetchingState.Loaded) {
                props.onDataLoad?.call(this);
            } else if (fetchingState === FetchingState.Error) {
                props.onDataError?.call(this);
            }
        }, [fetchingState, props.onDataError, props.onDataLoad])

        const value = repoData ? getValue(props, repoData) : null;
        let formattedValue = null;
        if (value) {
            if (props.formatter) {
                formattedValue = props.formatter(value);
            } else {
                formattedValue = defaultFormatter(value);
            }
        }
        return (
            <span id={props.id} className={classNames(getClasses(className, fetchingState, props.className))}>
                {getContent(fetchingState, formattedValue, props.loading, props.error)}
            </span>
        )
    }
    Component.displayName = name;
    return Component;
};

export default createGitHubComponent;