import { HashRouter, Routes, Route } from 'react-router-dom';
import { Archive } from './pages/Archive';
import { Offer } from './pages/Offer';
import { ConfigWarning } from './components/ConfigWarning';
import { useEntries } from './hooks/useEntries';
import { useAdminAccess } from './hooks/useAdminAccess';

export default function App() {
  const admin = useAdminAccess();
  const { entries, loading, addEntry, reportEntry, deleteEntry } = useEntries(admin.passcode);

  return (
    <HashRouter>
      <ConfigWarning />
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
