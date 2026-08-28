import './index.scss';

export default function EmployeeSkeleton() {
  return (
    <ul className="employee-list employee-list--loading" aria-label="Loading employees" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <li className="employees-list__skeleton" key={index}>
          <span className="employee-skeleton__avatar" />
          <div className="employee-skeleton__info">
            <span className="employee-skeleton__line employee-skeleton__line--name" />
            <span className="employee-skeleton__line employee-skeleton__line--position" />
          </div>
        </li>
      ))}
    </ul>
  );
}
