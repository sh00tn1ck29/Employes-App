import { type Employee, type SortMode } from '../../types/employee';
import { getBirthYear } from '../../utils/dateUtils';
import DateDivider from '../DateDivider';
import EmployeeItem from '../EmployeeItem';
import './index.scss';

interface Props {
  employees: Employee[];
  sort: SortMode;
  onSelect: (emp: Employee) => void;
}

export default function EmployeeList({ employees, sort, onSelect }: Props) {
  const showBirthday = sort === 'birthday';

  if (sort !== 'birthday') {
    return (
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp.id} className="employee-list__item">
            <EmployeeItem
              emp={emp}
              showBirthday={false}
              onClick={() => onSelect(emp)}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="employee-list">
      {employees.map((emp, index) => {
        const year = getBirthYear(emp.birthDate);
        const previousYear = index > 0 ? getBirthYear(employees[index - 1].birthDate) : null;
        return (
          <li key={emp.id} className="employee-list__item">
            {year !== previousYear && <DateDivider year={year} />}
            <EmployeeItem
              emp={emp}
              showBirthday={showBirthday}
              onClick={() => onSelect(emp)}
            />
          </li>
        );
      })}
    </ul>
  );
}
