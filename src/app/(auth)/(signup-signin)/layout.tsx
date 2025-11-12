import '@/styles/auth.css';
import { SimpleAuthPanel } from '../misc/components';

interface AuthLayoutProps {
  children: React.ReactNode;
}


export default function Layout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <section className='grid lg:grid-cols-[1fr,.75fr] sm:w-full max-w-[1790px] p-4 h-screen overflow-hidden mx-auto'>
      {children}
      <div className='hidden lg:flex'>
        <SimpleAuthPanel
          images={['/auth-pages-bg.jpg']}
          title={"Explore What’s Around"}
          text={'Delve connects you to reliable businesses for every moment, every need.'}
        />
      </div>
    </section>
  );
}
