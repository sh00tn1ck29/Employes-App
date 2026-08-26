import { type Employee } from '../../types/employee';
import { formatBirthdayShort, formatPosition, getEmployeeName } from '../../utils/dateUtils';
import './index.scss';

interface Props {
  emp: Employee;
  showBirthday: boolean;
  onClick: () => void;
}

export default function EmployeeItem({ emp, showBirthday, onClick }: Props) {
  const name = getEmployeeName(emp);
  return (
    <button className="employee-item" onClick={onClick}>
        <img
          className="employee-item__avatar"
          src={emp.avatarUrl}
          alt={name}
        />
        <div className="employee-item__info">
          <p className="employee-item__name">
            {name}
            <span className="employee-item__tag">{emp.tag ?? ''}</span>
          </p>
          <p className="employee-item__dept">{formatPosition(emp.position)}</p>
        </div>
        {showBirthday && (
          <span className="employee-item__birthday">
            {formatBirthdayShort(emp.birthDate)}
          </span>
        )}
    </button>
  );
}
