import { getFriendlyError } from '@/lib/utils/error';

interface ServerErrorAlertProps {
  error: unknown;
}

const ServerErrorAlert = ({ error }: ServerErrorAlertProps) => {
  const friendly = getFriendlyError(error);

  return (
    <div className="error-messages" style={{ maxWidth: 640, margin: '12px auto' }}>
      <ul>
        <li>{friendly.title}</li>
        {friendly.details?.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServerErrorAlert;
