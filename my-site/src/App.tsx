// src/App.tsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PrimeReactProvider } from 'primereact/api';

import Footer from './components/footer/index.tsx';
import Advertisements from './components/advertisements/index.tsx';
import News from './components/news/index.tsx';
import ScrollTopButton from './components/scroll-top-button/ScrollTopButton.tsx';
import Navbar from './components/navbar/index.tsx';
import Loader from './components/loader/Loader.tsx';
import api from './lib/api'
import './i18n/config';

// Lazy load page components
const Home = lazy(() => import('./pages/home/index.tsx'));
const Blog = lazy(() => import('./pages/Blog.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Claims = lazy(() => import('./pages/claims/index.tsx'));
const Mayor = lazy(() => import('./pages/mayor/index.tsx'));
const Potentials = lazy(() => import('./pages/potentials/index.tsx'));
const SecretaryGeneral = lazy(() => import('./pages/secretary-general/index.tsx'));
const History = lazy(() => import('./pages/history/index.tsx'));
const PapersPage = lazy(() => import('./pages/papers/index.tsx'));
const PaperDetails = lazy(() => import('./pages/papers/details/index.tsx'));
const SharePage = lazy(() => import('./pages/share/SharePage.tsx'));
const Events = lazy(() => import('./pages/events/index.tsx'));
const Persons = lazy(() => import('./pages/persons/index.tsx'));
const QuickLinks = lazy(() => import('./pages/quick-links/index.tsx'));
const ImportantNumbers = lazy(() => import('./pages/important-numbers/index.tsx'));

interface Ad {
  id: number
  title: string
  description?: string
  link: string
  file_type: 'image' | 'pdf'
}



const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    // Set text direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    api
      .get('/ads', { params: { lang: i18n.language } })
      .then((res) => setAds(res.data))
      .catch((err) => console.error('Failed to fetch ads:', err));
  }, [i18n.language]);

  return (
    <PrimeReactProvider>
      <div>
        <Navbar />
        <main className="container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/potentials" element={<Potentials />} />
              <Route path="/mayor" element={<Mayor />} />
              <Route path="/secretary-general" element={<SecretaryGeneral />} />
              <Route path="/history" element={<History />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/papers" element={<PapersPage />} />
              <Route path="/papers/:id" element={<PaperDetails />} />
              <Route path="/events" element={<Events />} />
              <Route path="/persons" element={<Persons />} />
              <Route path="/quick-links" element={<QuickLinks />} />
              <Route path="/important-numbers" element={<ImportantNumbers />} />
              <Route path="/share" element={<SharePage />} />
            </Routes>
          </Suspense>
        </main>
        <Advertisements ads={ads} />
        <News />
        <Footer />
        <ScrollTopButton />
      </div>
    </PrimeReactProvider>
  )
}

export default App
