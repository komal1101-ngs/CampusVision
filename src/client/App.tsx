import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { NewInspection } from './pages/NewInspection';
import { InspectionsList } from './pages/InspectionsList';
import { InspectionDetail } from './pages/InspectionDetail';
import { IssuesBoard } from './pages/IssuesBoard';
import { IssueDetail } from './pages/IssueDetail';
import { CampusMapPage } from './pages/CampusMapPage';
import { AdminLocations } from './pages/AdminLocations';
import { AdminCategories } from './pages/AdminCategories';
import { AdminUsers } from './pages/AdminUsers';
import { Login } from './pages/Login';

export const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {!isLoginPage && <Header />}

      <div className="flex-1 flex">
        {!isLoginPage && <Sidebar />}

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inspections/new" element={<NewInspection />} />
            <Route path="/inspections" element={<InspectionsList />} />
            <Route path="/inspections/:id" element={<InspectionDetail />} />
            <Route path="/issues" element={<IssuesBoard />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/map" element={<CampusMapPage />} />
            <Route path="/admin/locations" element={<AdminLocations />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
