'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useState } from 'react';
import { DeactivateBusinessModal } from '@/components/business/settings/DeactivateBusinessModal';

const tabs = [
  { name: 'General', href: '/business/settings/general' },
  { name: 'Profile', href: '/business/settings/profile' },
  { name: 'Services', href: '/business/settings/services' },
  { name: 'Contact', href: '/business/settings/contact' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentBusiness } = useBusinessContext();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{currentBusiness?.name || 'Business Settings'}</h1>
            <p className="text-muted-foreground">Manage your business details and account settings</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (currentBusiness?.id) {
                  router.push(`/businesses/${currentBusiness.id}`);
                }
              }}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Preview Business Profile →
            </Button>
            <Button
              onClick={() => setShowDeactivateModal(true)}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              Deactivate Business
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {children}
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <DeactivateBusinessModal
          businessId={currentBusiness?.id || 0}
          businessName={currentBusiness?.name || ''}
          onClose={() => setShowDeactivateModal(false)}
        />
      )}
    </div>
  );
}
