import './index.scss';

export default function ProfileLoader() {
  return (
    <div className="profile-loader" role="status" aria-label="Loading employee">
      <span className="profile-loader__spinner">
        <svg viewBox="22 22 44 44" aria-hidden="true">
          <circle cx="44" cy="44" r="20.2" fill="none" />
        </svg>
      </span>
    </div>
  );
}
