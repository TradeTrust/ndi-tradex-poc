import debug from "debug";

const log = debug("app");

export const createLogger = (namespace: string) => log.extend(namespace);
