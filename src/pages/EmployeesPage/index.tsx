import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEmployees } from '../../common/gateways';
import { type Employee, type SortMode } from '../../common/types';
import { getBirthDateValue } from '../../common/utils';
import EmployeeFilter from '../../components/EmployeeFilter';
import EmployeeList from '../../components/EmployeeList';
import EmployeeSkeleton from '../../components/EmployeeSkeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import SortModal from '../../components/SortModal';
import './index.scss';

const POSITIONS = [
  'All',
  'DESIGNER',
  'ANALYST',
  'MANAGER',
  'DEVELOPER',
  'RECRUITER',
];

function readFilters(search: string) {
  const params = new URLSearchParams(search);
  const requestedSort = params.get('sortBy');
  const sort: SortMode =
    requestedSort === 'alphabet' || requestedSort === 'birthDate'
      ? requestedSort === 'birthDate'
        ? 'birthday'
        : requestedSort
      : 'createdDate';
  const requestedPosition = params.get('position');

  return {
    query: params.get('searchText') ?? '',
    position: requestedPosition ? requestedPosition.toUpperCase() : 'All',
    sort,
  };
}

export default function EmployeesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, position, sort } = useMemo(
    () => readFilters(location.search),
    [location.search],
  );
  const [showSort, setShowSort] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requestVersion, setRequestVersion] = useState(0);
  const [requestState, setRequestState] = useState({
    version: -1,
    error: false,
  });
  const loading = requestState.version !== requestVersion;
  const error = !loading && requestState.error;

  useEffect(() => {
    const controller = new AbortController();

    getEmployees(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) {
          setEmployees(list);
          setRequestState({ version: requestVersion, error: false });
        }
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        )
          return;
        if (!controller.signal.aborted)
          setRequestState({ version: requestVersion, error: true });
      });

    return () => controller.abort();
  }, [requestVersion]);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      navigate({ pathname: '/', search: params.toString() }, { replace: true });
    },
    [location.search, navigate],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = employees.filter(
      (employee) => position === 'All' || employee.position === position,
    );

    if (normalizedQuery) {
      list = list.filter((employee) =>
        [
          employee.firstName,
          employee.lastName,
          employee.email,
          employee.tag ?? '',
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      );
    }

    return [...list].sort((a, b) => {
      if (sort === 'alphabet') return a.firstName.localeCompare(b.firstName);
      if (sort === 'birthday')
        return getBirthDateValue(a.birthDate) - getBirthDateValue(b.birthDate);
      return a.createdDate - b.createdDate;
    });
  }, [employees, position, query, sort]);

  const openProfile = (employee: Employee) => {
    navigate({
      pathname: `/employees/${encodeURIComponent(employee.id)}`,
      search: location.search,
    });
  };

  return (
    <div className="app">
      <EmployeeFilter
        query={query}
        dept={position}
        sort={sort}
        positions={POSITIONS}
        onQueryChange={(value) =>
          updateSearchParams({ searchText: value || null })
        }
        onDeptChange={(value) =>
          updateSearchParams({
            position: value === 'All' ? null : value.toLowerCase(),
          })
        }
        onSortOpen={() => setShowSort(true)}
      />
      {loading ? (
        <EmployeeSkeleton />
      ) : error ? (
        <ErrorState
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <EmployeeList employees={filtered} sort={sort} onSelect={openProfile} />
      )}
      {showSort && (
        <SortModal
          current={sort}
          onSelect={(value) => {
            updateSearchParams({
              sortBy:
                value === 'createdDate'
                  ? null
                  : value === 'birthday'
                    ? 'birthDate'
                    : value,
            });
            setShowSort(false);
          }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );
}
