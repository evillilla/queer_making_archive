import { HashRouter, Routes, Route } from 'react-router-dom';
import { Archive } from './pages/Archive';
import { Offer } from './pages/Offer';
import { useEntries } from './hooks/useEntries';
import { useAdminAuth } from './hooks/useAdminAuth';

export default function App() {
  const { entries, loading, addEntry, reportEntry, deleteEntry } = useEntries();
  const admin = useAdminAuth();

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Archive
              entries={entries}
              loading={loading}
              admin={admin}
              reportEntry={reportEntry}
              deleteEntry={deleteEntry}
            />
          }
        />
        <Route path="/offer" element={<Offer entries={entries} addEntry={addEntry} />} />
      </Routes>
    </HashRouter>
  );
}
