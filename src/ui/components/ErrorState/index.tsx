import './index.scss';
import errorIcon from '../../../assets/icons/error.svg';

interface Props {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: Props) {
  return (
    <div className="error-state">
      <img className="error-state__icon" src={errorIcon} alt="" />
      <p className="error-state__title">Unexpected error occurred...</p>
      <p className="error-state__message">Try again later</p>
      <button className="error-state__retry" onClick={onRetry}>
        Reload page
      </button>
    </div>
  );
}
