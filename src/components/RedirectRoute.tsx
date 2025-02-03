import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function RedirectRoute({ to }: { to: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [to]);

  return null;
}

export default RedirectRoute;
