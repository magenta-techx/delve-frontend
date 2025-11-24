import { LoginForm, AuthTabsShell } from '../../misc/components';
export const metadata = {
  title: 'Auth - Sign in',
  description: 'User authentication - sign in',
};


export default function Page(): JSX.Element {
  return (
    <AuthTabsShell active='login'>
      <LoginForm />
    </AuthTabsShell>
  );
}
