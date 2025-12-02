import '@/styles/auth.css';
import { SimpleAuthPanel } from '../misc/components';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <section className='mx-auto grid h-screen max-w-[1920px] overflow-y-scroll p-4 sm:w-full lg:grid-cols-[1fr,.85fr]'>
      {children}
      <div className='hidden lg:flex'>
        <SimpleAuthPanel />
      </div>
    </section>
  );
}
