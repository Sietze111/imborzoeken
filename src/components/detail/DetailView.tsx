import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { imborData } from '@/data/imbordata';
import { usePageTitle } from '@/hooks/usePageTitle';
import { fields, getDefinition } from '@/utils/definitions';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const DetailView = () => {
  usePageTitle('Object Details');
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    setIsLoading(true);
    try {
      if (!itemId) {
        setError('Geen object ID gevonden');
        return null;
      }
      const item = imborData[parseInt(itemId)];
      if (!item) {
        setError('Object niet gevonden');
        return null;
      }
      return item;
    } catch (error) {
      console.error(error);
      setError('Er is een fout opgetreden bij het laden van het object');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !selectedItem) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <ErrorMessage
          message={error || 'Object niet gevonden'}
          retry={() => navigate('/')}
        />
      </div>
    );
  }

  const handleFieldClick = (field: string, value: string) => {
    if (field !== 'type_extra_detail' && value) {
      navigate(`/overview?field=${field}&value=${encodeURIComponent(value)}`);
    }
  };

  const navigateToSearch = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={navigateToSearch}>Zoeken</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>IMBOR Object Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-4">
            {fields.map(({ label, field }) => {
              const value = selectedItem[field];
              const definition = getDefinition(field, value);

              return (
                <div key={field} className="col-span-3">
                  <dt className="font-semibold">{label}:</dt>
                  <dd
                    className={`mt-1 ${
                      field !== 'type_extra_detail' && value
                        ? 'underline cursor-pointer text-primary hover:text-primary/80'
                        : ''
                    }`}
                    onClick={() =>
                      field !== 'type_extra_detail' &&
                      value &&
                      handleFieldClick(field, value)
                    }
                  >
                    {value || '-'}
                  </dd>
                  {definition !== '-' && (
                    <dd className="mt-1 text-sm text-muted-foreground bg-muted p-2 rounded">
                      {definition}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};
