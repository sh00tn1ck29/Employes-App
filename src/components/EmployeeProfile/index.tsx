import { type Employee } from '../../common/types';
import { formatBirthDate, formatPosition, getAge, getEmployeeName } from '../../common/utils';
import './index.scss';

const backIcon = '/icons/back.svg';
const phoneIcon = '/icons/phone.svg';
const starIcon = '/icons/star.svg';

interface Props {
  emp: Employee;
  onBack: () => void;
}

export default function EmployeeProfile({ emp, onBack }: Props) {
  const name = getEmployeeName(emp);
  return (
    <div className="profile">
      <div className="profile__top">
        <div className="profile__content">
          <button
            className="profile__back"
            onClick={onBack}
            aria-label="Go back"
          >
            <img src={backIcon} alt="" />
          </button>
          <img className="profile__avatar" src={emp.avatarUrl} alt={name} />
          <p className="profile__title">
            {name}
            <span className="profile__tag">{emp.tag ?? ''}</span>
          </p>
          <p className="profile__role">{formatPosition(emp.position)}</p>
        </div>
      </div>

      <div className="profile__details">
        <div className="profile-row">
          <span className="profile-row__icon">
            <img src={starIcon} alt="Star" />
          </span>
          <span className="profile-row__value">
            {formatBirthDate(emp.birthDate)}
          </span>
          <span className="profile-row__aside">
            {getAge(emp.birthDate)} years old
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-row__icon">
            <img src={phoneIcon} alt="Phone" />
          </span>
          <a
            className="profile-row__value profile-row__value--plain"
            href={`tel:${emp.phone}`}
          >
            {emp.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
