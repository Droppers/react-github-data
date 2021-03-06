import React, { useEffect, useState } from "react";
import { IBaseProps } from "@/types/types";
import { api } from "@/utils/api";
import { STORAGE_AGE_MINUTES } from "@/constants";
import DataStore from "@/store/DataStore";
import { DataState } from "@/types/enums";
import classNames from "@/utils/classnames";

const getClasses = (
  classNamePrefix: string,
  name: string,
  fetchingState: DataState,
  initialClass: string | undefined
): string[] => {
  const classes: string[] = [
    classNamePrefix + "-data",
    `${classNamePrefix}-${name}`,
  ];
  if (initialClass) {
    classes.push(initialClass);
  }
  switch (fetchingState) {
    case DataState.Fetching:
      classes.push(classNamePrefix + "-loading");
      break;
    case DataState.Fetched:
      classes.push(classNamePrefix + "-loaded");
      break;
    case DataState.Error:
      classes.push(classNamePrefix + "-error");
      break;
  }
  return classes;
};

const getContent = (
  fetching: DataState,
  value: React.ReactElement | string | null,
  loading?: React.ReactElement | string,
  error?: React.ReactElement | string
): React.ReactElement | string => {
  if (value !== null) {
    return value;
  } else if (fetching === DataState.Fetching && loading) {
    return loading;
  } else if (fetching === DataState.Error && error) {
    return error;
  }
  return "";
};

const defaultFormatter = (
  value: React.ReactElement | string | number
): React.ReactElement | string => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return value;
};

const getClassName = (name: string): string =>
  (name.startsWith("GitHub") ? name.slice(6) : name).toLowerCase();

type BaseProps<TData> = IBaseProps<TData> &
  React.HTMLAttributes<HTMLDivElement>;

const createDataComponent = <TProps, TData, TResponse>(
  version: number,
  name: string,
  classNamePrefix: string,
  createDataUrl: (props: TProps) => string,
  createIdentifier: (props: TProps) => string,
  getValue: (
    props: TProps,
    data: TData
  ) => React.ReactElement | string | number | null,
  mapResponse: (data: TResponse) => TData
): React.FC<TProps & BaseProps<TData>> => {
  const store = new DataStore<TData>(name, STORAGE_AGE_MINUTES, version);

  const Component: React.FC<TProps & BaseProps<TData>> = (
    props: TProps & BaseProps<TData>
  ): JSX.Element => {
    const identifier = createIdentifier(props);
    const [entry, setEntry] = useState(store.get(identifier));

    useEffect(
      () => store.subscribe(identifier, (entry) => setEntry({ ...entry })),
      [identifier]
    );
    useEffect(() => {
      if (!store.isWaiting(identifier)) {
        return;
      }

      api<TResponse>(createDataUrl(props))
        .then((data: TResponse): TData => mapResponse(data))
        .then((data: TData) => store.setData(identifier, data))
        .catch((reason: Error) => {
          console.error(
            `Could not load data for component ${name} (${identifier}):`,
            reason.message
          );
          store.setState(identifier, DataState.Error);
        });
    }, [identifier, props]);

    useEffect(() => {
      if (entry.state === DataState.Fetched) {
        props.onDataLoad?.call(this);
      } else if (entry.state === DataState.Error) {
        props.onDataError?.call(this);
      }
    }, [entry.state, props.onDataError, props.onDataLoad]);

    let content = null;
    if (entry.data && props.content) {
      content = props.content(entry.data);
    } else {
      const value = entry.data ? getValue(props, entry.data) : null;
      content = value !== null ? defaultFormatter(value) : null;
    }

    return (
      <div
        id={props.id}
        className={classNames(
          getClasses(
            classNamePrefix,
            getClassName(name),
            entry.state,
            props.className
          )
        )}
      >
        {getContent(entry.state, content, props.loading, props.error)}
      </div>
    );
  };
  Component.displayName = name;
  return Component;
};

export default createDataComponent;
