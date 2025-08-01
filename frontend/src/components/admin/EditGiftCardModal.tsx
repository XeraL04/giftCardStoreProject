// src/components/admin/EditGiftCardModal.tsx
import { useEffect, useState } from 'react';
import type { GiftCard } from '../../pages/admin/AdminGiftCards';
import api from '../../api/client';

interface EditGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard: GiftCard | null;
  onUpdated: (updatedCard: GiftCard) => void;
}

export default function EditGiftCardModal({ isOpen, onClose, giftCard, onUpdated }: EditGiftCardModalProps) {
  const [brand, setBrand] = useState('');
  const [value, setValue] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (giftCard) {
      setBrand(giftCard.brand);
      setValue(giftCard.value);
      setPrice(giftCard.price);
      setStock(giftCard.stock);
      setImageUrl(giftCard.imageUrl ?? '');
      setError(null);
    }
  }, [giftCard]);

  if (!isOpen || !giftCard) return null;

  const validate = (): string | null => {
    if (!brand.trim()) return 'Brand is required.';
    if (value === '' || value <= 0) return 'Value must be a positive number.';
    if (price === '' || price < 0) return 'Price must be zero or a positive number.';
    if (stock === '' || stock < 0) return 'Stock must be zero or a positive number.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError){
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
      const res = await api.put<GiftCard>(`/giftcards/${giftCard._id}`, payload);
      onUpdated(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update gift card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
      aria-labelledby="edit-giftcard-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="edit-giftcard-title" className="text-xl font-semibold mb-4">Edit Gift Card</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Brand *"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Value *"
            value={value}
            onChange={e => setValue(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Price *"
            value={price}
            onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            step={0.01}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock *"
            value={stock}
            onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
