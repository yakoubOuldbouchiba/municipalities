import React from 'react';
import { useTranslation } from 'react-i18next';

const AdsPage: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('ads.manage', 'Manage Advertisements here')}</div>;
};

export default AdsPage;
