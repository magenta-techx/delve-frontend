import BusinessPricingList from '@/components/business/BusinessPricingList';
import BusinessSectionHeader from '@/components/business/BusinessSectionHeader';

export default function Page(): JSX.Element {
  return (
    <div className='mt-10'>
      {' '}
      <BusinessSectionHeader text='Select business plan to continue' />
      <BusinessPricingList />
    </div>
  );
}
