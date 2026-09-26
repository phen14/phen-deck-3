import pRetry, {AbortError} from 'p-retry';

const run = async (call: Function) => {
    const response = await call();

    // Abort retrying if the resource doesn't exist
    if (response.status === 404) {
        throw new AbortError(response.statusText);
    }

    return response.blob();
};

export const retry = async (call: Function) => {
    return pRetry(() => run(call), {retries: 5});
}
