import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { PageContainer } from './components/layout/PageContainer';


// pages
import { Home } from './pages/Home/Home'; 
import { Merge } from './pages/Merge/Merge';
import { Split } from './pages/Split/Split';


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/merge" element={<Merge />} />
          <Route path="/split" element={<Split />} />
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;