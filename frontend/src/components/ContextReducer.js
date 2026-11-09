import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext([]);
const CartDispatchContext = createContext(() => {});

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      // Same dish in the same size: bump the quantity instead of adding a new row.
      const index = state.findIndex((item) => item.id === action.id && item.size === action.size);
      if (index !== -1) {
        const next = [...state];
        const item = next[index];
        next[index] = { ...item, qty: item.qty + action.qty, price: item.price + action.price };
        return next;
      }
      return [
        ...state,
        { id: action.id, name: action.name, qty: action.qty, size: action.size, price: action.price, img: action.img },
      ];
    }
    case 'REMOVE':
      return state.filter((_, i) => i !== action.index);
    case 'DROP':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
