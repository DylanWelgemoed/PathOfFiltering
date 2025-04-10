import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import FilterMaster from './components/filter-master/filter-master';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilterMaster />} />
      </Routes>
    </Router>
  );
}
