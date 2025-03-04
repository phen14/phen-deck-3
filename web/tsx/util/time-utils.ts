const ONE_SECOND = 1;

const ONE_MINUTE = 60 * ONE_SECOND;
const MINUTES_CUTOFF = 1 * ONE_MINUTE;

const ONE_HOUR: number = 60 * ONE_MINUTE;
const HOURS_CUTOFF: number = 99 * ONE_MINUTE;

const ONE_DAY = 24 * ONE_HOUR;
const DAYS_CUTOFF = 3 * ONE_DAY;

export const timeSince = (then: Date): string => {
    const now: Date = new Date();
    const diff: number = Math.round((now.getTime() - then.getTime()) / 1000);

    if (diff > DAYS_CUTOFF) {
        return `-${Math.round(diff / ONE_DAY)}d`;
    }
    if (diff > HOURS_CUTOFF) {
        return `-${Math.round(diff / ONE_HOUR)}h`;
    }
    if (diff > MINUTES_CUTOFF) {
        return `-${Math.round(diff / ONE_MINUTE)}m`;
    }
    return `-${Math.round(diff / ONE_SECOND)}s`;
}
