// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/index.tsx';
import Blog from './pages/Blog.tsx';
import Contact from './pages/Contact.tsx';
import Mayor from './pages/mayor/index.tsx';
import Footer from './components/footer/index.tsx';
import Advertisements from './components/advertisements/index.tsx';
import News from './components/news/index.tsx';
import Potentials from './pages/potentials/index.tsx';
import SecretaryGeneral from './pages/secretary-general/index.tsx';
import History from './pages/history/index.tsx';
import ScrollTopButton from './components/scroll-top-button/ScrollTopButton.tsx';
import PapersPage from './pages/papers/index.tsx';
import PaperDetails from './pages/papers/details/index.tsx';
import SharePage from './pages/share/SharePage.tsx';
import Navbar from './components/navbar/index.tsx';


const App: React.FC = () => {
   const ads: { title: string; link: string; fileType?: "image" | "pdf" }[] = [
  {  title: 'Municipality launches digital services', link: 'https://unej.dz/savedIMG//images/pages/l4qrj2s6SRRMULLS1RS.jpeg'  , fileType: 'image'},
  {  title: 'New road renovation project approved', link: 'https://unej.dz/savedIMG//images/pages/l4qrj2s6SRRMULLS1RS.jpeg'  , fileType: 'image'},
  {  title: 'Public meeting with the Mayor this Sunday', link: 'https://unej.dz/savedIMG//images/pages/l4qrj2s6SRRMULLS1RS.jpeg'  , fileType: 'image'}
]


  return (
    <div>
     <Navbar />
      <main className="container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/potentials" element={<Potentials />} />
          <Route path="/mayor" element={<Mayor />} />
          <Route path="/secretary-general" element={<SecretaryGeneral />} />
          <Route path="/history" element={<History />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/papers/:id" element={<PaperDetails />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>
      </main>
      <Advertisements ads={ads} />
      <News />
      <Footer />
      <ScrollTopButton /> 
    </div>
  )
}

export default App
