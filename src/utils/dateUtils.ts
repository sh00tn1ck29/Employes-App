const DAY_IN_MS = 86_400_000;

function parseBirthDate(dateStr: string): [number, number, number] {
  const [day, month, year] = dateStr.split('.').map(Number);
  return [year, month, day];
}

export function getBirthDateValue(dateStr: string): number {
  const [year, month, day] = parseBirthDate(dateStr);
  return new Date(year, month - 1, day).getTime();
}

export function getBirthYear(dateStr: string): number {
  return parseBirthDate(dateStr)[0];
}

function getNextBirthday(dateStr: string, today = new Date()): Date {
  const [, month, day] = parseBirthDate(dateStr);
  const next = new Date(today.getFullYear(), month - 1, day);

  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next.setFullYear(today.getFullYear() + 1);
  }

  return next;
}

export function getDaysUntilBirthday(dateStr: string): number {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((getNextBirthday(dateStr, today).getTime() - startOfToday.getTime()) / DAY_IN_MS);
}

export function getNextBirthdayYear(dateStr: string): number {
  return getNextBirthday(dateStr).getFullYear();
}

export function getAge(dateStr: string): number {
  const [year, month, day] = parseBirthDate(dateStr);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age--;
  return age;
}

export function formatBirthDate(dateStr: string): string {
  const [year, month, day] = parseBirthDate(dateStr);
  const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(year, month - 1, day));
  return `${day} ${monthName} ${year}`;
}

export function formatBirthdayShort(dateStr: string): string {
  const [year, month, day] = parseBirthDate(dateStr);
  const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(year, month - 1, day));
  return `${day} ${monthName}`;
}

export function formatPosition(position: string, plural = false): string {
  const normalized = position.toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return plural && !label.endsWith('s') ? `${label}s` : label;
}

export function getEmployeeName(employee: { firstName: string; lastName: string }): string {
  return `${employee.firstName} ${employee.lastName}`;
}
