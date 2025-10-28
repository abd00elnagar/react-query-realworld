import { AxiosError } from 'axios';

export type FriendlyError = {
  title: string;
  details?: string[];
  isClientError: boolean;
  status?: number;
};

export function getFriendlyError(err: unknown): FriendlyError {
  // Default unknown error
  const fallback: FriendlyError = {
    title: 'Internal Server Error',
    details: undefined,
    isClientError: false,
  };

  const ax = err as AxiosError<any>;
  const status = ax?.response?.status;

  if (!status) {
    return fallback;
  }

  // 4xx => show server-provided messages if available
  if (status >= 400 && status < 500) {
    const data = ax.response?.data as any;
    const messages: string[] = [];

    // Common RealWorld error shape: { errors: { field: [msg], 'email or password': [msg] } }
    const errors = data?.errors;
    if (errors && typeof errors === 'object') {
      Object.entries(errors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => messages.push(`${key}: ${String(v)}`));
        } else if (typeof value === 'string') {
          messages.push(`${key}: ${value}`);
        }
      });
    }

    const message = data?.message || ax.message;
    if (!messages.length && message) messages.push(String(message));

    return {
      title: 'There was a problem with your request',
      details: messages.length ? messages : undefined,
      isClientError: true,
      status,
    };
  }

  // 5xx => generic
  return { ...fallback, status };
}
