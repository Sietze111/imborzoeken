import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { imborData } from '@/data/imbordata';
import { fields, getDefinition } from '@/utils/definitions';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export const DetailView = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  // Get item from itemId
  const selectedItem = imborData[parseInt(itemId)];

  if (!selectedItem) {
    return <Navigate to="/" replace />;
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
                        ? 'underline cursor-pointer text-blue-600'
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
                    <dd className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
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
