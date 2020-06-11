const globalTimeout = global.setTimeout;

export const sleep = (timeout = 0) => new Promise(resolve => globalTimeout(resolve, timeout));
