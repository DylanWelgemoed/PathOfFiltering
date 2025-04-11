import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import FilterMaster from './components/filter-master/filter-master';
import { useInputFocus } from './components/foundation/use-input-focus';

export default function App() {
  useInputFocus();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilterMaster />} />
      </Routes>
    </Router>
  );
}
