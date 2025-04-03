export const ProgressBar = (progress: number, total: number, length: number, disablePercent?: boolean, varnish?: boolean) => {
    const percent = Math.round((progress / total) * 100);
    const filledLength = Math.round((length * progress) / total);
    const bar = '<:bar_:1174313407290290296>'.repeat(filledLength) + '<:bar:1174313408896696351>'.repeat(length - filledLength);
    return disablePercent ? `${bar}` : `${bar} ${varnish ? `\`${percent}% (${progress}/${total})\`` : `${percent}% (${progress}/${total})`}`
};