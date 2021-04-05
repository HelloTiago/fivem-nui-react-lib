import { useEffect } from "react";
import { NuiServiceContext } from "../context/NuiServiceContext";
import { eventNameFactory } from "../utils/eventNameFactory";

export interface IAbortableFetch {
  abort: () => void;
  promise: Promise<Response>;
}

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

export const NuiServiceProvider = ({
  resource,
  children,
}: {
  resource: string;
  children: JSX.Element;
}) => {
  const eventListener = (event: any) => {
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

  const send = async (event: string, data = {}) => {
    return fetch(...getParams(resource, event, data));
  };
  const sendAbortable = (event: string, data = {}): IAbortableFetch => {
    return abortableFetch(...getParams(resource, event, data));
  };

  return (
    <NuiServiceContext.Provider
      value={{ resource, send, sendAbortable }}
    ></NuiServiceContext.Provider>
  );
};
