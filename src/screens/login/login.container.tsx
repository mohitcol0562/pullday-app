import { useState } from 'react';

import { apiClient } from '../../network';
import { MOCK_EMAIL, MOCK_PASSWORD } from '../../network/mock/user';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginView } from './login.view';

export function LoginContainer() {
  const { setSession } = useAuthStore();
  const [email, setEmail] = useState(MOCK_EMAIL);
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await apiClient.login(email, password);
      setSession(token, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      isLoading={isLoading}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
