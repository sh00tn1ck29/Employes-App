import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '../Components/EmptyState';
import EmployeeFilter from '../Components/EmployeeFilter';
import EmployeeList from '../Components/EmployeeList';
import EmployeeProfile from '../Components/EmployeeProfile';
import EmployeeSkeleton from '../Components/EmployeeSkeleton';
import ErrorState from '../Components/ErrorState';
import ProfileLoader from '../Components/ProfileLoader';
import SortModal from '../Components/SortModal';
import { getEmployee, getEmployees } from '../services/employeesApi';
import { type Employee, type SortMode } from '../types/employee';
import { getBirthDateValue } from '../utils/dateUtils';
import './App.scss';

function readEmployeeId() {
  const match = window.location.pathname.match(/^\/employees\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function readFilters() {
  const params = new URLSearchParams(window.location.search);
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

const POSITIONS = ['All', 'DESIGNER', 'ANALYST', 'MANAGER', 'DEVELOPER', 'RECRUITER'];

export default function App() {
  const [initialFilters] = useState(() => readFilters());
  const [query, setQuery] = useState(initialFilters.query);
  const [position, setPosition] = useState(initialFilters.position);
  const [sort, setSort] = useState<SortMode>(initialFilters.sort);
  const [showSort, setShowSort] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(readEmployeeId);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      const filters = readFilters();
      setLoading(true);
      setError(false);
      setQuery(filters.query);
      setPosition(filters.position);
      setSort(filters.sort);
      setEmployeeId(readEmployeeId());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('searchText', query);
    if (position !== 'All') params.set('position', position.toLowerCase());
    if (sort !== 'createdDate') params.set('sortBy', sort === 'birthday' ? 'birthDate' : sort);
    const search = params.toString();
    const path = employeeId ? `/employees/${encodeURIComponent(employeeId)}` : '/';
    window.history.replaceState(null, '', `${path}${search ? `?${search}` : ''}`);
  }, [query, position, sort, employeeId]);

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
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [employeeId, requestVersion]);

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
      return b.createdDate - a.createdDate;
    });
  }, [employees, position, query, sort]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    setRequestVersion((version) => version + 1);
  }, []);

  const openProfile = (employee: Employee) => {
    window.history.pushState(null, '', `/employees/${encodeURIComponent(employee.id)}${window.location.search}`);
    setLoading(true);
    setError(false);
    setEmployeeId(employee.id);
  };

  const closeProfile = () => {
    window.history.pushState(null, '', `/${window.location.search}`);
    setLoading(true);
    setError(false);
    setEmployeeId(null);
  };

  if (employeeId) {
    if (loading) return <ProfileLoader />;
    if (error || !profile) return <ErrorState onRetry={retry} />;
    return <EmployeeProfile emp={profile} onBack={closeProfile} />;
  }

  return (
    <div className="app">
      <EmployeeFilter
        query={query}
        dept={position}
        sort={sort}
        positions={POSITIONS}
        onQueryChange={setQuery}
        onDeptChange={setPosition}
        onSortOpen={() => setShowSort(true)}
      />
      {loading ? <EmployeeSkeleton /> : error ? <ErrorState onRetry={retry} /> : filtered.length === 0
        ? <EmptyState />
        : <EmployeeList employees={filtered} sort={sort} onSelect={openProfile} />}
      {showSort && (
        <SortModal
          current={sort}
          onSelect={(value) => { setSort(value); setShowSort(false); }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );
}
