console.warn("@ NuiServiceContext is deprecated, please use NuiContext instead");

import { createContext } from "react";
import { IAbortableFetch } from "../providers/NuiProvider";

export interface NuiServiceContext {
  resource: string;
  callbackTimeout: number;
  send: (e: string, data?: unknown) => Promise<Response>;
  sendAbortable: (e: string, data: unknown) => IAbortableFetch;
}

export const NuiServiceContext = createContext<NuiServiceContext>(null);
