import React, { useCallback, useEffect, useRef } from "react";
import { NuiContext } from "../context/NuiContext";
import { eventNameFactory } from "../utils/eventNameFactory";
import { IAbortableFetch } from "./NuiProvider";

function abortableFetch(request, opts): IAbortableFetch {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    abort: () => controller.abort(),
    promise: fetch(request, { ...opts, signal }),
  };
}

function getParams(resource, event, data): [RequestInfo, RequestInit] {
  return [
    `https://${resource}/${event}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    },
  ];
}

const DEFAULT_TIMEOUT = 10000;

export const NuiServiceProvider = ({
  resource,
  children,
  timeout,
}: {
  timeout?: number;
  resource: string;
  children: JSX.Element;
}): JSX.Element => {
  console.warn("@ NuiServiceProvider is deprecated, please use NuiProvider instead");

  const resourceRef = useRef<string>();

  const eventListener = (event: { data: { app: string; method: string; data: unknown } }) => {
    const { app, method, data } = event.data;
    if (app && method) {
      window.dispatchEvent(
        new MessageEvent(eventNameFactory(app, method), {
          data,
        })
      );
    }
  };

  useEffect(() => {
    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  }, []);

  const send = useCallback(async (event: string, data = {}, overrideResource = resource) => {
    return fetch(...getParams(overrideResource, event, data));
  }, []);

  const sendAbortable = useCallback((event: string, data = {}): IAbortableFetch => {
    return abortableFetch(...getParams(resource, event, data));
  }, []);

  return (
    <NuiContext.Provider
      value={{
        resource: resourceRef.current,
        send,
        sendAbortable,
        callbackTimeout: timeout || DEFAULT_TIMEOUT,
      }}
    >
      {children}
    </NuiContext.Provider>
  );
};
