import { type Employee } from '../types/employee';

const API_URL = 'https://68f747b1f7fb897c66152f05.mockapi.io/employees';

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Employees API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function getEmployees(signal?: AbortSignal): Promise<Employee[]> {
  return request<Employee[]>(API_URL, signal);
}

export function getEmployee(id: string, signal?: AbortSignal): Promise<Employee> {
  return request<Employee>(`${API_URL}/${encodeURIComponent(id)}`, signal);
}
