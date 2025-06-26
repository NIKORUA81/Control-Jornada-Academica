import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { viewConfig, type UserRole } from '@/config/views';

interface AppSidebarProps {
  onNavigate: (viewId: string) => void;
  currentView: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onNavigate, currentView }) => {
  const { user, logout } = useAuth();

  const accessibleViews = viewConfig.filter(view => 
    user && view.allowedRoles.includes(user.role as UserRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 text-center border-b">
        <h2 className="text-xl font-bold">CJA</h2>
        {user && <p className="text-sm text-muted-foreground">{user.fullName}</p>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {accessibleViews.map((view) => {
            const Icon = view.icon;
            return (
              <SidebarMenuItem key={view.id}>
                <SidebarMenuButton
                  tooltip={view.label}
                  onClick={() => onNavigate(view.id)}
                  data-active={currentView === view.id}
                  // --- CORRECCIÓN: Estilo para el botón activo ---
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};