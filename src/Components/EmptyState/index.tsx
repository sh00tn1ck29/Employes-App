import emptyIcon from '../../assets/icons/magnifying-glass.svg';
import './index.scss';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <img className="empty-state__icon" src={emptyIcon} alt="" />
      <p className="empty-state__title">We didn't find anyone</p>
      <p className="empty-state__subtitle">Try to adjust your request</p>
    </div>
  );
}
