
// src/app/admin/login/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { loginAction, type LoginFormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: LoginFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Entrando...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        title: 'Erro de Login',
        description: state.message,
        variant: 'destructive',
      });
    }
    // No success toast here, as successful login will redirect.
  }, [state, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>Acesse o painel administrativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground"
                defaultValue="allyssoncidade@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground"
              />
            </div>
            {state.message && !state.success && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
