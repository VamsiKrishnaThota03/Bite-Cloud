import React, { useEffect } from 'react';
import ReactDom from 'react-dom';

export default function Modal({ children, onClose, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return ReactDom.createPortal(
    <>
      <div className="bc-modal-overlay" onClick={onClose} />
      <div className="bc-modal p-4" role="dialog" aria-modal="true" aria-label={title}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">{title}</h2>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} autoFocus />
        </div>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  );
}
