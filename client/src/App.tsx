import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import Navbar from './components/layout/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
        {/* The Navbar will appear on all pages */}
        <Navbar />
        {/* The AppRouter will render the correct page based on the URL */}
        <AppRouter />
    </BrowserRouter>
  );
}

export default App;
