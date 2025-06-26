import { useState, useEffect } from 'react';

// Importaciones de Hooks y Contextos
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

// Importaciones de Componentes Locales y Tipos
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import type { LoginFormData, RegisterFormData } from './components/schemas';

// --- Componente Principal ---

export const AuthPage = () => {
    const { login, register } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    // Efecto para limpiar el error cuando se cambia de pestaña
    useEffect(() => {
        setError(null);
    }, [activeTab]);

    const handleLogin = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await login(data);
            // El cambio de vista a la página principal se manejará en App.tsx
        } catch (err: any) {
            // Manejo de errores más seguro
            const errorMessage = err?.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await register({
                email: data.email,
                username: data.username,
                fullName: data.fullName,
                password: data.password,
                role: 'DOCENTE' // Rol por defecto al registrarse
            });
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            setActiveTab('login'); // Cambia a la pestaña de login después de un registro exitoso
        } catch (err: any) {
             const errorMessage = err?.response?.data?.message || 'Error en el registro. El email o usuario puede que ya existan.';
             setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Control de Jornadas Académicas</h1>
                    <p className="text-muted-foreground">Bienvenido, por favor inicia sesión o crea una cuenta.</p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" disabled={isSubmitting}>Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register" disabled={isSubmitting}>Registrarse</TabsTrigger>
                    </TabsList>
                    <Card className="mt-4">
                        <CardContent className="pt-6">
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <TabsContent value="login">
                                <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
                            </TabsContent>
                            <TabsContent value="register">
                                <RegisterForm onSubmit={handleRegister} isSubmitting={isSubmitting} />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
};