import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/features/auth/AuthPage';
import MainLayout from '@/components/layout/MainLayout';
import { UserEditDialog } from '@/features/userManagement/components/UserEditDialog';
import { SubjectCreateDialog } from '@/features/subjects/components/SubjectCreateDialog';
import { GroupCreateDialog } from '@/features/groups/components/GroupCreateDialog';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <MainLayout /> : <AuthPage />}
      
      {/* DIÁLOGOS GLOBALES */}
      <UserEditDialog />
      <SubjectCreateDialog />
      <GroupCreateDialog />
    </>
  );
}

export default App;