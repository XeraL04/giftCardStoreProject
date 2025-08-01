// src/components/admin/AddGiftCardModal.tsx
import { useState } from 'react';
import type { GiftCard } from '../../pages/admin/AdminGiftCards';
import api from '../../api/client';

interface AddGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (newCard: GiftCard) => void;
}

export default function AddGiftCardModal({ isOpen, onClose, onAdded }: AddGiftCardModalProps) {
  const [brand, setBrand] = useState('');
  const [value, setValue] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!brand.trim()) return 'Brand is required.';
    if (value === '' || value <= 0) return 'Value must be a positive number.';
    if (price === '' || price < 0) return 'Price must be zero or a positive number.';
    if (stock === '' || stock < 0) return 'Stock must be zero or a positive number.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        brand: brand.trim(),
        value: Number(value),
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl.trim() || undefined,
      };
      const res = await api.post<GiftCard>('/giftcards', payload);
      onAdded(res.data);
      // Clear form
      setBrand('');
      setValue('');
      setPrice('');
      setStock('');
      setImageUrl('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add gift card.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
      aria-labelledby="add-gift-card-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 id="add-gift-card-title" className="text-xl font-semibold mb-4">
          Add New Gift Card
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Brand *"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Value *"
            value={value}
            onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Price *"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            step={0.01}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock *"
            value={stock}
            onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            {loading ? 'Adding...' : 'Add Gift Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
