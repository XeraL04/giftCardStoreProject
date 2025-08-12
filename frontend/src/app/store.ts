import { create } from 'zustand';

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  avatarUrl?: string;
  token: string
};

type CartItem = {
  giftCardId: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (giftCardId: string) => void;
  updateQuantity: (giftCardId: string, quantity: number) => void;
  clearCart: () => void;
};

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ user });
  },
}));

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (newItem) => {
    const items = get().items;
    const existingIndex = items.findIndex(i => i.giftCardId === newItem.giftCardId);
    if (existingIndex >= 0) {
      // If item exists, update quantity
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += newItem.quantity;
      set({ items: updatedItems });
    } else {
      set({ items: [...items, newItem] });
    }
  },
  removeFromCart: (giftCardId) => {
    set({ items: get().items.filter(i => i.giftCardId !== giftCardId) });
  },
  updateQuantity: (giftCardId, quantity) => {
    const items = get().items;
    const updated = items.map(item =>
      item.giftCardId === giftCardId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);
    set({ items: updated });
  },
  clearCart: () => set({ items: [] }),
}));
