import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DetailView } from './components/detail/DetailView';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/overview/OverviewView';
import { SchemaView } from './components/schema/SchemaView';
import { SearchView } from './components/search/SearchView';
import { StatisticsView } from './components/statistics/StatisticsView';

// Add this constant at the top of the file
const BASE_URL = import.meta.env.BASE_URL;

const App = () => {
  return (
    <BrowserRouter basename={BASE_URL}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <Routes>
            <Route path="/" element={<SearchView />} />
            <Route path="/detail/:itemId" element={<DetailView />} />
            <Route path="/overview" element={<OverviewView />} />
            <Route path="/statistics" element={<StatisticsView />} />
            <Route path="/schema" element={<SchemaView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
