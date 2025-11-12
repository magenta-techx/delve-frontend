import SignUpForm from "../../misc/components/SignUpForm";
import AuthTabsShell from "../../misc/components/AuthTabsShell";

export const metadata = {
  title: 'Auth - Sign up',
  description: 'User authentication - sign up',
};

export default function Page(): JSX.Element {
  return (
    <AuthTabsShell active="signup">
      <SignUpForm />
    </AuthTabsShell>
  );
}
