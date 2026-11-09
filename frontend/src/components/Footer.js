import React from 'react';

function Footer() {
  return (
    <footer className="bc-footer py-4 mt-5">
      <div className="container d-flex flex-wrap justify-content-between gap-2 small text-body-secondary">
        <span>© {new Date().getFullYear()} Bite-Cloud</span>
        <span>Fresh food, delivered warm.</span>
      </div>
    </footer>
  );
}

export default Footer;
