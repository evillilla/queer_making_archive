import { HashRouter, Routes, Route } from 'react-router-dom';
import { Archive } from './pages/Archive';
import { Offer } from './pages/Offer';
import { useEntries } from './hooks/useEntries';

export default function App() {
  const { entries, addEntry } = useEntries();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Archive entries={entries} />} />
        <Route path="/offer" element={<Offer entries={entries} addEntry={addEntry} />} />
      </Routes>
    </HashRouter>
  );
}
