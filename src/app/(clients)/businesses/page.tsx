import type { Metadata } from 'next';
import BusinessesLandingPage from './page.client';

export const metadata: Metadata = {
  title: 'Delve Businesses ',
  description:
    'List your business on Delve and connect with customers who need what you offer.',
};

export default function DashboardPage(): JSX.Element {
  return <BusinessesLandingPage />;
}
