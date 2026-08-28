import { useState } from 'react';
import { type SortMode } from '../../common/types';
import './index.scss';

const closeIcon = '/icons/close.svg';

interface Props {
  current: SortMode;
  onSelect: (s: SortMode) => void;
  onClose: () => void;
}

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'alphabet', label: 'Alphabet' },
  { value: 'birthday', label: 'Birth date' },
];

export default function SortModal({ current, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState(current);
  const [closing, setClosing] = useState(false);

  const finishWithAnimation = (callback: () => void) => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(callback, 195);
  };

  const handleClose = () => finishWithAnimation(onClose);
  const handleSelect = (value: SortMode) => {
    setSelected(value);
    finishWithAnimation(() => onSelect(value));
  };

  return (
    <>
      <div className={`sort-backdrop${closing ? ' sort-backdrop--closing' : ''}`} onClick={handleClose} />

      {/* Mobile: bottom drawer */}
      <div className={`sort-drawer${closing ? ' sort-drawer--closing' : ''}`}>
        <div className="sort-drawer__sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sort-drawer__content">
            <h3 className="sort-drawer__title">Sort by</h3>
            <div className="sort-drawer__options">
              {OPTIONS.map((opt) => (
                <label key={opt.value} className="sort-option">
                  <input
                    className="sort-option__radio"
                    type="radio"
                    name="sort-mobile"
                    checked={selected === opt.value}
                    onChange={() => undefined}
                    onClick={() => handleSelect(selected === opt.value ? 'createdDate' : opt.value)}
                  />
                  <span className="sort-option__control" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                      <path className="sort-option__dot" d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z" />
                    </svg>
                  </span>
                  <span className="sort-option__label">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: center dialog */}
      <div className={`sort-dialog${closing ? ' sort-dialog--closing' : ''}`} onClick={handleClose}>
        <div className="sort-dialog__box" onClick={(e) => e.stopPropagation()}>
          <button className="sort-dialog__close" onClick={handleClose}>
            <img src={closeIcon} alt="" />
          </button>
          <h3 className="sort-dialog__title">Sort by</h3>
          <div className="sort-dialog__options">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="sort-option">
                <input
                  className="sort-option__radio"
                  type="radio"
                  name="sort-desktop"
                  checked={selected === opt.value}
                  onChange={() => undefined}
                  onClick={() => handleSelect(selected === opt.value ? 'createdDate' : opt.value)}
                />
                <span className="sort-option__control" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    <path className="sort-option__dot" d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z" />
                  </svg>
                </span>
                <span className="sort-option__label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
