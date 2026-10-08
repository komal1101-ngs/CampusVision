import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { UserProfile, UserRole } from '../../shared/types';
import { supabase } from '../services/supabaseClient';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  SAFETY_OFFICER: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'safety@gmrit.edu.in',
    full_name: 'Officer Marcus Reed',
    role: 'SAFETY_OFFICER',
    department: 'GMRIT Campus Safety & Compliance',
  },
  ADMIN: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'admin@gmrit.edu.in',
    full_name: 'Director Alex Vance',
    role: 'ADMIN',
    department: 'GMRIT Campus Operations & Administration',
  },
  FACILITY_MANAGER: {
    id: '33333333-3333-4333-8333-333333333333',
    email: 'facility@gmrit.edu.in',
    full_name: 'Manager Sarah Chen',
    role: 'FACILITY_MANAGER',
    department: 'GMRIT Infrastructure & Maintenance',
  },
  TEACHER: {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'faculty@gmrit.edu.in',
    full_name: 'Prof. David Miller',
    role: 'TEACHER',
    department: 'GMRIT Engineering Faculty',
  },
  STUDENT: {
    id: '55555555-5555-4555-8555-555555555555',
    email: 'student@gmrit.edu.in',
    full_name: 'Jordan Taylor',
    role: 'STUDENT',
    department: 'GMRIT Student Council',
  },
};

interface AuthContextType {
  currentUser: UserProfile;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('visioncampus_active_role') as UserRole) || 'SAFETY_OFFICER';
  });

  const currentUser = DEMO_USERS[role] || DEMO_USERS.SAFETY_OFFICER;

  useEffect(() => {
    localStorage.setItem('visioncampus_active_role', role);
    localStorage.setItem('visioncampus_active_user_id', currentUser.id);
  }, [role, currentUser]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('visioncampus_active_role', newRole);
    localStorage.setItem('visioncampus_active_user_id', DEMO_USERS[newRole].id);
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    switchRole('STUDENT');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        switchRole,
        isAuthenticated: true,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
