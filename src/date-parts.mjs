export class DatePartsError extends Error {
  constructor(message, part) { super(message); this.part = part; }
}

export function dateFromParts({month, day, year}) {
  if (!/^(0?[1-9]|1[0-2])$/.test(month)) throw new DatePartsError('Choose a month.', 'month');
  if (!/^(0?[1-9]|[12]\d|3[01])$/.test(day)) throw new DatePartsError('Choose a day.', 'day');
  const cleanYear = year.trim();
  if (!/^\d{4}$/.test(cleanYear)) throw new DatePartsError('Enter a four-digit year.', 'year');
  if (+cleanYear < 1900 || +cleanYear > 2099) throw new DatePartsError('Enter a year between 1900 and 2099.', 'year');
  return `${cleanYear}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
}

export function splitDate(value) {
  const [year = '', month = '', day = ''] = value.split('-');
  return {month: month ? String(+month) : '', day: day ? String(+day) : '', year};
}
