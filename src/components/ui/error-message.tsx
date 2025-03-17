interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorMessage = ({
  title = 'Error',
  message,
  retry,
}: ErrorMessageProps) => (
  <div className="rounded-lg border border-destructive/50 p-4">
    <h3 className="font-semibold text-destructive">{title}</h3>
    <p className="text-sm text-destructive/90 mt-1">{message}</p>
    {retry && (
      <button
        onClick={retry}
        className="mt-2 text-sm text-destructive hover:text-destructive/90 underline"
      >
        Try again
      </button>
    )}
  </div>
);
