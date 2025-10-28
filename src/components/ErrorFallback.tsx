import { useNavigate } from 'react-router-dom';
import { getFriendlyError } from '@/lib/utils/error';

interface IErrorFallbackProps {
  resetErrorBoundary: (...args: unknown[]) => void;
  error?: unknown;
}

const ErrorFallback = ({ resetErrorBoundary, error }: IErrorFallbackProps) => {
  const navigate = useNavigate();
  const friendly = getFriendlyError(error);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="logo-font">{friendly.title}</h1>
      {friendly.details && friendly.details.length > 0 && (
        <ul className="error-messages" style={{ maxWidth: 640, margin: '12px auto' }}>
          {friendly.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
      <div className="btn-group">
        <button type="button" className="btn btn-outline-danger" onClick={() => resetErrorBoundary()}>
          Try again
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            navigate('/', { replace: true });
            window.location.reload();
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
