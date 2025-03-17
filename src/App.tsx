import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DetailView } from './components/detail/DetailView';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/overview/OverviewView';
import { SchemaDetailView } from './components/schema/SchemaDetailView';
import { SchemaView } from './components/schema/SchemaView';
import { SearchView } from './components/search/SearchView';
import { StatisticsView } from './components/statistics/StatisticsView';
import { ThemeProvider } from './components/theme-provider';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Get base URL from environment
const BASE_URL = import.meta.env.BASE_URL;

const AppContent = () => {
  useKeyboardShortcuts();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-8">
        <Routes>
          <Route path="/" element={<SearchView />} />
          <Route path="/detail/:itemId" element={<DetailView />} />
          <Route path="/overview" element={<OverviewView />} />
          <Route path="/statistics" element={<StatisticsView />} />
          <Route path="/schema" element={<SchemaView />} />
          <Route path="/schema/:tableName" element={<SchemaDetailView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <BrowserRouter basename={BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
