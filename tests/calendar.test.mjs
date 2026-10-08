import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays,
  CalendarInputError,
  calendarMonths,
  dateString,
  lunarAge,
  lunarDate,
  parseDate,
  predict,
} from '../src/calendar.mjs';
import { CHART, CHART_VERSION } from '../src/chart.mjs';

// Independent date fixtures: Hong Kong Observatory conversion tables.
// https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2024e.txt
// https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2025e.txt
// https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2026e.txt
// https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2027e.txt
const officialDates = [
  ['2024-02-09', 2023, 12, 30, false],
  ['2024-02-10', 2024, 1, 1, false],
  ['2024-02-29', 2024, 1, 20, false],
  ['2025-01-28', 2024, 12, 29, false],
  ['2025-01-29', 2025, 1, 1, false],
  ['2025-06-25', 2025, 6, 1, false],
  ['2025-07-24', 2025, 6, 30, false],
  ['2025-07-25', 2025, 6, 1, true],
  ['2025-08-22', 2025, 6, 29, true],
  ['2025-08-23', 2025, 7, 1, false],
  ['2026-02-16', 2025, 12, 29, false],
  ['2026-02-17', 2026, 1, 1, false],
  ['2027-02-05', 2026, 12, 29, false],
  ['2027-02-06', 2027, 1, 1, false],
  ['2027-08-31', 2027, 7, 30, false],
  ['2027-09-01', 2027, 8, 1, false],
];

test('Gregorian conversion matches official New Year, leap-month, and month-end dates', () => {
  for (const [solar, year, month, day, leap] of officialDates) {
    assert.deepEqual(lunarDate(solar), { year, month, day, leap }, solar);
  }
});

test('lunar age changes at Chinese New Year, before the Gregorian birthday', () => {
  const birth = '2000-12-31';
  assert.equal(lunarAge(birth, '2026-01-01').age, 26);
  assert.equal(lunarAge(birth, '2026-02-04').age, 26, 'Lichun is not the age boundary');
  assert.equal(lunarAge(birth, '2026-02-16').age, 26);
  assert.equal(lunarAge(birth, '2026-02-17').age, 27);
  assert.equal(lunarAge(birth, '2026-12-30').age, 27);
  assert.equal(lunarAge(birth, '2026-12-31').age, 27, 'birthday adds no second year');
});

test('births before Chinese New Year belong to the preceding lunar year', () => {
  const result = lunarAge('1990-01-01', '2026-02-17');
  assert.equal(result.born.year, 1989);
  assert.equal(result.at.year, 2026);
  assert.equal(result.age, 38);
});

test('lunar age starts at one and rejects target dates before birth', () => {
  assert.equal(lunarAge('2000-06-01', '2000-06-01').age, 1);
  assert.throws(() => lunarAge('2000-06-01', '2000-05-31'), /birth date must be before/);
  assert.throws(() => predict('2025-05-01', '2025-04-30'), /birth date must be before/);
  assert.throws(() => predict('2025-05-01', '2025-06-01', 'due'), /birth date must be before/);
});

test('due-date estimation subtracts 266 calendar days across leap day and year end', () => {
  // 266-day convention: MSD Manual, Pregnancy Test and Due Date.
  // https://www.msdmanuals.com/home/women-s-health-issues/normal-pregnancy/pregnancy-test-and-due-date
  const cases = [
    ['2024-11-21', '2024-02-29'],
    ['2024-11-22', '2024-03-01'],
    ['2026-10-01', '2026-01-08'],
    ['2027-01-01', '2026-04-10'],
  ];
  for (const [due, conception] of cases) {
    assert.equal(addDays(due, -266), conception, due);
    const estimated = predict('1995-06-01', due, 'due');
    const direct = predict('1995-06-01', conception, 'conception');
    assert.equal(estimated.conception, conception);
    assert.equal(estimated.estimated, true);
    assert.equal(direct.estimated, false);
    assert.deepEqual({ ...estimated, estimated: false }, direct);
  }
});

test('traditional chart preserves its declared version and distinguishing cells', () => {
  // Source revision: 8c5338d043a85ad3b4de2af0dd516bd6c7d2b62b.
  // https://github.com/bdp-raymon/chinese-gender-prediction/blob/8c5338d043a85ad3b4de2af0dd516bd6c7d2b62b/src/calendar.php
  assert.equal(CHART_VERSION, 'traditional-bdp-raymon-v1');
  assert.deepEqual(Object.keys(CHART).map(Number), Array.from({ length: 28 }, (_, i) => i + 18));
  for (const row of Object.values(CHART)) assert.match(row, /^[BG]{12}$/);
  assert.equal(CHART[18], 'GBGBBBBBBBBB');
  assert.equal(CHART[45], 'GBBGGGBGBGBB');
  // Age 33 / month 3 differs in other circulated charts; avoid silently changing versions.
  assert.equal(CHART[33][2], 'G');
  const march = predict('1993-06-01', '2025-03-29');
  assert.equal(march.age, 33);
  assert.equal(march.lunar.month, 3);
  assert.equal(march.prediction, 'Girl');
  assert.equal(predict('1993-06-01', '2025-04-28').prediction, 'Boy');
});

test('leap month keeps its flag and uses the matching numbered chart month', () => {
  const regular = predict('2000-06-01', '2025-06-25');
  const leap = predict('2000-06-01', '2025-07-25');
  const seventh = predict('2000-06-01', '2025-08-23');
  assert.equal(regular.age, 26);
  assert.deepEqual(regular.lunar, { year: 2025, month: 6, day: 1, leap: false });
  assert.deepEqual(leap.lunar, { year: 2025, month: 6, day: 1, leap: true });
  assert.equal(regular.prediction, 'Boy');
  assert.equal(leap.prediction, 'Boy');
  assert.equal(seventh.prediction, 'Girl');
  assert.equal(leap.nearBoundary, true, 'regular-to-leap transition is a boundary');
  assert.equal(predict('2000-06-01', '2025-08-05').nearBoundary, false);
});

test('chart accepts lunar ages 18 and 45 and rejects rather than clamps 17 and 46', () => {
  const target = '2025-03-29';
  const youngest = predict('2008-06-01', target);
  const oldest = predict('1981-06-01', target);
  assert.equal(youngest.age, 18);
  assert.equal(youngest.prediction, 'Girl');
  assert.equal(oldest.age, 45);
  assert.equal(oldest.prediction, 'Boy');
  assert.throws(() => predict('2009-06-01', target), /lunar age is 17/);
  assert.throws(() => predict('1980-06-01', target), /lunar age is 46/);
});

test('valid conception dates at the end of 2099 survive the nearby-date check', () => {
  for (const conception of ['2099-12-25', '2099-12-31']) {
    const result = predict('2070-06-01', conception);
    assert.equal(result.conception, conception);
    assert.equal(result.age, 30);
    assert.equal(result.prediction, 'Boy');
    assert.equal(result.estimated, false);
    assert.equal(typeof result.nearBoundary, 'boolean');
  }
});

test('strict input validation rejects impossible, incomplete, and unsupported dates', () => {
  const invalid = [
    undefined, null, '', '2025-2-01', '2025-02-1', '2025/02/01',
    '2025-02-29', '1900-02-29', '2024-02-30', '2025-04-31',
    '2025-00-01', '2025-13-01', '2025-01-00', '2025-01-32',
    '2025-01-01T00:00:00Z', ' 2025-01-01', '1899-12-31', '2100-01-01',
  ];
  for (const input of invalid) assert.throws(() => parseDate(input), Error, String(input));
  for (const input of ['1900-01-01', '2000-02-29', '2024-02-29', '2099-12-31']) {
    assert.equal(dateString(parseDate(input).date), input);
  }
  assert.throws(() => predict('1995-06-01', '2025-02-29'), /valid calendar date/);
  assert.throws(() => predict('1995-06-01', '2025-02-28', 'unknown'), /Choose conception date or due date/);
});

test('invalid dates identify the input to focus instead of blaming every error on the target date', () => {
  const cases = [
    [() => predict('1800-01-01', '2026-05-01'), 'birth', /between 1900 and 2099/],
    [() => predict('1995-06-15', '2026-02-30'), 'target', /valid calendar date/],
    [() => predict('1995-06-15', '1800-01-01', 'due'), 'target', /between 1900 and 2099/],
    [() => predict('1900-01-01', '1900-02-01', 'due'), 'target', /estimated conception date is before 1900/],
    [() => predict('2026-06-01', '2026-05-01'), 'birth', /birth date must be before/],
    [() => predict('2009-06-01', '2025-03-29'), 'birth', /lunar age is 17/],
    [() => lunarAge('1800-01-01', '2026-05-01'), 'birth', /between 1900 and 2099/],
    [() => lunarAge('1995-06-15', '2100-01-01'), 'target', /between 1900 and 2099/],
  ];
  for (const [run, field, message] of cases) {
    assert.throws(run, error => error instanceof CalendarInputError && error.field === field && message.test(error.message));
  }
});

test('day arithmetic remains calendar-based across daylight-saving transitions', () => {
  assert.equal(addDays('2024-03-10', 1), '2024-03-11');
  assert.equal(addDays('2024-11-03', 1), '2024-11-04');
  assert.equal(addDays('2024-03-01', -1), '2024-02-29');
});

test('2027 month ranges match HKO and cover all 365 days exactly once', () => {
  const months = calendarMonths(2027);
  const expectedStarts = [
    ['2027-01-01', 2026, 11],
    ['2027-01-08', 2026, 12],
    ['2027-02-06', 2027, 1],
    ['2027-03-08', 2027, 2],
    ['2027-04-07', 2027, 3],
    ['2027-05-06', 2027, 4],
    ['2027-06-05', 2027, 5],
    ['2027-07-04', 2027, 6],
    ['2027-08-02', 2027, 7],
    ['2027-09-01', 2027, 8],
    ['2027-09-30', 2027, 9],
    ['2027-10-29', 2027, 10],
    ['2027-11-28', 2027, 11],
    ['2027-12-28', 2027, 12],
  ];
  assert.deepEqual(months.map(({ start, year, month }) => [start, year, month]), expectedStarts);
  assert.equal(months[0].day, 24);
  assert.equal(months[0].start, '2027-01-01');
  assert.equal(months.at(-1).end, '2027-12-31');

  const dayMs = 86_400_000;
  const yearStart = Date.UTC(2027, 0, 1);
  const yearEnd = Date.UTC(2027, 11, 31);
  const covered = new Set();
  for (const [index, record] of months.entries()) {
    const start = Date.parse(`${record.start}T00:00:00Z`);
    const end = Date.parse(`${record.end}T00:00:00Z`);
    assert.equal(record.leap, false);
    assert.ok(start <= end && start >= yearStart && end <= yearEnd);
    if (index > 0) {
      assert.equal(record.day, 1);
      assert.equal(start - Date.parse(`${months[index - 1].end}T00:00:00Z`), dayMs);
    }
    for (let day = start; day <= end; day += dayMs) {
      assert.equal(covered.has(day), false, `overlap on ${new Date(day).toISOString().slice(0, 10)}`);
      covered.add(day);
    }
  }
  assert.equal(covered.size, 365);
  for (let day = yearStart; day <= yearEnd; day += dayMs) {
    assert.ok(covered.has(day), `missing ${new Date(day).toISOString().slice(0, 10)}`);
  }
});
