import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <>
      <Navbar />
      <main className="d-flex align-items-center justify-content-center px-3 py-5">
        <div className="bc-auth p-4 p-sm-5 shadow">
          <h1 className="h3 fw-bold mb-1">{title}</h1>
          <p className="text-body-secondary mb-4">{subtitle}</p>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
