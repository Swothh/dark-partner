export function is24HoursPassed(timestamp: number): boolean {
    const now = new Date();
    const lastQuestDate = new Date(timestamp);

    const elapsedTimeInMilliseconds = now.getTime() - lastQuestDate.getTime();
    const elapsedTimeInHours = elapsedTimeInMilliseconds / 3600000;

    return elapsedTimeInHours >= 24;
};