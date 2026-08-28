import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import EmployeesPage from './pages/EmployeesPage';

export default function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<EmployeesPage />} />
      <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
      <Route
        path="*"
        element={
          <Navigate to={{ pathname: '/', search: location.search }} replace />
        }
      />
    </Routes>
  );
}
