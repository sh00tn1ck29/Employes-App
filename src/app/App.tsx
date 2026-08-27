import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom';
import EmptyState from '../ui/components/EmptyState';
import EmployeeFilter from '../ui/components/EmployeeFilter';
import EmployeeList from '../ui/components/EmployeeList';
import EmployeeProfile from '../ui/components/EmployeeProfile';
import EmployeeSkeleton from '../ui/components/EmployeeSkeleton';
import ErrorState from '../ui/components/ErrorState';
import ProfileLoader from '../ui/components/ProfileLoader';
import SortModal from '../ui/components/SortModal';
import { getEmployee, getEmployees } from '../services/employeesApi';
import { type Employee, type SortMode } from '../types/employee';
import { getBirthDateValue } from '../utils/dateUtils';
import './App.scss';

const POSITIONS = ['All', 'DESIGNER', 'ANALYST', 'MANAGER', 'DEVELOPER', 'RECRUITER'];

function readFilters(search: string) {
  const params = new URLSearchParams(search);
  const requestedSort = params.get('sortBy');
  const sort: SortMode = requestedSort === 'alphabet' || requestedSort === 'birthDate'
    ? requestedSort === 'birthDate' ? 'birthday' : requestedSort
    : 'createdDate';
  const requestedPosition = params.get('position');

  return {
    query: params.get('searchText') ?? '',
    position: requestedPosition ? requestedPosition.toUpperCase() : 'All',
    sort,
  };
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileMatch = useMatch('/employees/:employeeId');
  const employeeId = profileMatch?.params.employeeId ?? null;
  const { query, position, sort } = useMemo(() => readFilters(location.search), [location.search]);
  const [showSort, setShowSort] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const requestKey = `${employeeId ?? 'employees'}:${requestVersion}`;
  const [requestState, setRequestState] = useState({ key: '', error: false });
  const loading = requestState.key !== requestKey;
  const error = !loading && requestState.error;

  useEffect(() => {
    const controller = new AbortController();

    const request = employeeId
      ? getEmployee(employeeId, controller.signal).then((employee) => {
          setProfile(employee);
          setEmployees([]);
        })
      : getEmployees(controller.signal).then((list) => {
          setEmployees(list);
          setProfile(null);
        });

    request
      .then(() => {
        if (!controller.signal.aborted) setRequestState({ key: requestKey, error: false });
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        if (!controller.signal.aborted) setRequestState({ key: requestKey, error: true });
      });

    return () => controller.abort();
  }, [employeeId, requestKey]);

  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = employees.filter((employee) => position === 'All' || employee.position === position);

    if (normalizedQuery) {
      list = list.filter((employee) =>
        [employee.firstName, employee.lastName, employee.email, employee.tag ?? '']
          .some((value) => value.toLowerCase().includes(normalizedQuery)),
      );
    }

    return [...list].sort((a, b) => {
      if (sort === 'alphabet') return a.firstName.localeCompare(b.firstName);
      if (sort === 'birthday') return getBirthDateValue(a.birthDate) - getBirthDateValue(b.birthDate);
      return a.createdDate - b.createdDate;
    });
  }, [employees, position, query, sort]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  const openProfile = (employee: Employee) => {
    navigate({ pathname: `/employees/${encodeURIComponent(employee.id)}`, search: location.search });
  };

  const closeProfile = () => {
    navigate({ pathname: '/', search: location.search });
  };

  const directoryPage = (
    <div className="app">
      <EmployeeFilter
        query={query}
        dept={position}
        sort={sort}
        positions={POSITIONS}
        onQueryChange={(value) => updateSearchParams({ searchText: value || null })}
        onDeptChange={(value) => updateSearchParams({ position: value === 'All' ? null : value.toLowerCase() })}
        onSortOpen={() => setShowSort(true)}
      />
      {loading ? <EmployeeSkeleton /> : error ? <ErrorState onRetry={retry} /> : filtered.length === 0
        ? <EmptyState />
        : <EmployeeList employees={filtered} sort={sort} onSelect={openProfile} />}
      {showSort && (
        <SortModal
          current={sort}
          onSelect={(value) => {
            updateSearchParams({ sortBy: value === 'createdDate' ? null : value === 'birthday' ? 'birthDate' : value });
            setShowSort(false);
          }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );

  const profilePage = loading
    ? <ProfileLoader />
    : error || !profile
      ? <ErrorState onRetry={retry} />
      : <EmployeeProfile emp={profile} onBack={closeProfile} />;

  return (
    <Routes>
      <Route path="/" element={directoryPage} />
      <Route path="/employees/:employeeId" element={profilePage} />
      <Route path="*" element={<Navigate to={{ pathname: '/', search: location.search }} replace />} />
    </Routes>
  );
}
