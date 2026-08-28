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
