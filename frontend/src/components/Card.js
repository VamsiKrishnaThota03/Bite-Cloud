import React, { useState } from 'react';
import { useDispatchCart } from './ContextReducer';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#22262b"/><text x="80" y="56" font-family="sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">No image</text></svg>'
  );

const SIZE_ORDER = ['half', 'full', 'regular', 'medium', 'large'];

function Card({ id, foodName, imgSrc, description, options }) {
  const dispatch = useDispatchCart();
  // Options come from the API as [{ half: "130", full: "220" }].
  const priceOptions = (options && options[0]) || {};
  const sizes = Object.keys(priceOptions)
    .filter((key) => key !== '_id' && priceOptions[key])
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(sizes[0] || '');
  const [added, setAdded] = useState(false);

  const unitPrice = parseInt(priceOptions[size], 10) || 0;
  const finalPrice = qty * unitPrice;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD', id, name: foodName, price: finalPrice, qty, size, img: imgSrc });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bc-card d-flex flex-column">
      <img
        src={imgSrc || FALLBACK_IMG}
        className="bc-card-img"
        alt={foodName}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG;
        }}
      />
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h3 className="h6 fw-semibold mb-1">{foodName}</h3>
        {description && <p className="small text-body-secondary mb-3 flex-grow-1">{description}</p>}
        <div className="d-flex gap-2 align-items-center mb-3">
          <select
            className="form-select form-select-sm w-auto"
            aria-label={`Quantity of ${foodName}`}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm text-capitalize"
            aria-label={`Size of ${foodName}`}
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {sizes.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <span className="bc-price ms-auto text-nowrap">₹{finalPrice}</span>
        </div>
        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleAddToCart}
          disabled={!sizes.length}
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

export default Card;
