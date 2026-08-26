export interface Employee {
  id: string;
  createdDate: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  position: string;
  status: string;
  tag: string | null;
  avatarUrl: string;
}

export type SortMode = 'createdDate' | 'alphabet' | 'birthday';
