import { TNamedObject } from '../types';

const timeToMinutes = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
};

export const quickestTimeObj = <T extends TNamedObject<string>>(times: T[], field: string): T => {
    return times.reduce((minObj, currentObj) => {
        return timeToMinutes(currentObj[field]) < timeToMinutes(minObj[field]) ? currentObj : minObj;
    });
};

export const formatDate = (date: string | Date, locale: string = 'en-US'): string => {
    if (!isDateTime(date)) return 'NA';
    return new Intl.DateTimeFormat(locale, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
};

export const isDateTime = (value: unknown): value is Date => {
    if (value instanceof Date) {
        return !isNaN(value.getTime());
    }
    if (typeof value === 'string') {
        const parsed = new Date(value);
        return !isNaN(parsed.getTime());
    }
    return false;
};
