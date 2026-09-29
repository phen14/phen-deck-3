import pRetry, { RetryContext } from "p-retry";

const run = async (call: Function) => {
    return await call();
};

const shouldRetry = async (context: RetryContext) => {
    const cause = context.error?.cause as { status: number };
    const status = cause?.status;
    return !(status && status >= 400 && status < 500);
};

export const withRetry = async (call: Function) => {
    return pRetry(() => run(call), { minTimeout: 1000, randomize: true, retries: 3, shouldRetry });
};
