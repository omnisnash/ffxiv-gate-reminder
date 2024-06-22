export function formatTimestampMinutesSecondes(time: number) {
    const date = new Date(time);
    return `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

export function formatTimestampHoursMinutes(time: number) {
    const date = new Date(time);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function generateProgressFavicon(progress: number): void {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#3f544f';
    ctx.fillRect(0, 4, 16, 8);

    const grad = ctx.createLinearGradient(16, 0, 0, 0);
    grad.addColorStop(0, '#f94440');
    grad.addColorStop(1, '#fcf015');

    ctx.fillStyle = grad;
    ctx.fillRect(1, 5, 14, 6);

    ctx.fillStyle = '#3f544f';
    ctx.fillRect(15, 5, -13 * progress, 6);

    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL('image/x-icon');
    document.getElementsByTagName('head')[0].appendChild(link);
}
