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
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

export const OverviewView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const field = searchParams.get('field');
  const value = searchParams.get('value');

  if (!field || !value) {
    return <Navigate to="/" replace />;
  }

  const overviewItems = imborData.filter(
    (item) => item[field] === decodeURIComponent(value)
  );

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
          <BreadcrumbPage>Overzicht</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              {field}: {decodeURIComponent(value)}
            </span>
            <span className="text-sm text-gray-500">
              {overviewItems.length}{' '}
              {overviewItems.length === 1 ? 'resultaat' : 'resultaten'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {overviewItems.map((item, index) => (
              <Card
                key={index}
                className="w-full p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  const itemIndex = imborData.findIndex((i) => i === item);
                  navigate(`/detail/${itemIndex}`);
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Beheerlaag:</div>
                  <div>{item.beheerlaag || '-'}</div>

                  <div className="font-semibold">Objecttype:</div>
                  <div>{item.objecttype || '-'}</div>

                  <div className="font-semibold">Type:</div>
                  <div>{item.type || '-'}</div>

                  <div className="font-semibold">Type detail:</div>
                  <div>{item.type_detail || '-'}</div>

                  <div className="font-semibold">Type extra detail:</div>
                  <div>{item.type_extra_detail || '-'}</div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
