/// <reference types="react" />
import { IAbortableFetch } from "../providers/NuiProvider";
export interface NuiServiceContext {
  resource: string;
  callbackTimeout: number;
  send: (e: string, data?: unknown) => Promise<Response>;
  sendAbortable: (e: string, data: unknown) => IAbortableFetch;
}
export declare const NuiServiceContext: import("react").Context<NuiServiceContext>;
