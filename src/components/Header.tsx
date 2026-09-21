import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="archive-header">
      <div className="archive-header-top">
        <h1 className="archive-title">Digital Archive of Queer Making</h1>
        <Link to="/offer" className="offer-button">
          <Plus size={18} strokeWidth={3} />
          Offer something
        </Link>
      </div>
    </header>
  );
}
