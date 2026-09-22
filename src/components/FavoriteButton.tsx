import { SaveIcon, SavedIcon } from './customIcons';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export function FavoriteButton({ isFavorited, onToggle, size = 16, className }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-button${className ? ` ${className}` : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save this offering'}
      title={isFavorited ? 'Remove from favorites' : 'Save this offering'}
    >
      {isFavorited ? <SavedIcon size={size} /> : <SaveIcon size={size} />}
    </button>
  );
}
