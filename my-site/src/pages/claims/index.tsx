import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import CitizenClaimForm from './CitizenClaimForm';
import CompanyClaimForm from './CompanyClaimForm';
import OrganizationClaimForm from './OrganizationClaimForm';
import PageLayout from '../../components/layout/PageLayout';

const ClaimsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PageLayout>
      <div style={{ maxWidth: '100%' }}>
        <p style={{ marginBottom: '2rem', color: '#64748b', lineHeight: '1.6' }}>
          {t('claims.description')}
        </p>

        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header={t('claims.citizenTab')} leftIcon="pi pi-id-card">
            <CitizenClaimForm />
          </TabPanel>
          <TabPanel header={t('claims.companyTab')} leftIcon="pi pi-building">
            <CompanyClaimForm />
          </TabPanel>
          <TabPanel header={t('claims.organizationTab')} leftIcon="pi pi-sitemap">
            <OrganizationClaimForm />
          </TabPanel>
        </TabView>
      </div>
    </PageLayout>
  );
};

export default ClaimsPage;
