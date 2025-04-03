export function is12HoursPassed(timestamp: number): boolean {
    const now = new Date();
    const lastQuestDate = new Date(timestamp);

    const elapsedTimeInMilliseconds = now.getTime() - lastQuestDate.getTime();
    const elapsedTimeInHours = elapsedTimeInMilliseconds / (1000 * 60 * 60);

    return elapsedTimeInHours >= 12;
};