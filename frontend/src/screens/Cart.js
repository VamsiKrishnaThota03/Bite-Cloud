import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="display-6 mb-2" aria-hidden="true">🛒</div>
        <p className="fs-5 mb-1">Your cart is empty</p>
        <p className="text-body-secondary">Add a few dishes from the menu to get started.</p>
      </div>
    );
  }

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-4">
          <thead>
            <tr>
              <th scope="col" className="d-none d-sm-table-cell">#</th>
              <th scope="col">Dish</th>
              <th scope="col">Qty</th>
              <th scope="col">Size</th>
              <th scope="col" className="text-end">Amount</th>
              <th scope="col"><span className="visually-hidden">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={`${food.id}-${food.size}`}>
                <th scope="row" className="d-none d-sm-table-cell">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td className="text-capitalize">{food.size}</td>
                <td className="text-end">₹{food.price}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Remove ${food.name}`}
                    onClick={() => dispatch({ type: 'REMOVE', index })}
                  >
                    <span aria-hidden="true">✕</span>
                    <span className="d-none d-md-inline ms-1">Remove</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="fs-4 fw-bold">Total: ₹{totalPrice}</div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary text-nowrap" onClick={() => dispatch({ type: 'DROP' })}>
            Clear cart
          </button>
          <button type="button" className="btn btn-success text-nowrap" disabled title="Checkout is not implemented yet">
            Check out
          </button>
        </div>
      </div>
      <p className="small text-body-secondary mt-3 mb-0">Checkout is coming soon. Your cart is kept in this browser tab.</p>
    </div>
  );
}
