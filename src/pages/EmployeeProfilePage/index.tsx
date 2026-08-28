import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getEmployee } from '../../common/gateways';
import { type Employee } from '../../common/types';
import EmployeeProfile from '../../components/EmployeeProfile';
import ErrorState from '../../components/ErrorState';
import ProfileLoader from '../../components/ProfileLoader';

export default function EmployeeProfilePage() {
  const { employeeId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [requestState, setRequestState] = useState({ key: '', error: false });
  const requestKey = `${employeeId}:${requestVersion}`;
  const loading = requestState.key !== requestKey;

  useEffect(() => {
    const controller = new AbortController();

    getEmployee(employeeId, controller.signal)
      .then((profile) => {
        if (!controller.signal.aborted) {
          setEmployee(profile);
          setRequestState({ key: requestKey, error: false });
        }
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        )
          return;
        if (!controller.signal.aborted)
          setRequestState({ key: requestKey, error: true });
      });

    return () => controller.abort();
  }, [employeeId, requestKey]);

  if (loading) return <ProfileLoader />;

  if (requestState.error || !employee) {
    return (
      <ErrorState onRetry={() => setRequestVersion((version) => version + 1)} />
    );
  }

  return (
    <EmployeeProfile
      emp={employee}
      onBack={() => navigate({ pathname: '/', search: location.search })}
    />
  );
}
