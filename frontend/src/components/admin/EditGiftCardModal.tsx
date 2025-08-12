import { useEffect, useState } from 'react';
import type { GiftCard } from '../../pages/admin/AdminGiftCards';
import api from '../../api/client';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
      const res = await api.put<GiftCard>(`/giftcards/${giftCard._id}`, payload);
      onUpdated(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update gift card.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
      aria-labelledby="edit-giftcard-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white/90 backdrop-blur-md w-full max-w-lg rounded-3xl shadow-2xl border border-blue-100 p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-blue-50 pb-4 mb-6">
          <h2 id="edit-giftcard-title" className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <PencilSquareIcon className="w-6 h-6 text-blue-500" />
            Edit Gift Card
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Brand *</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Brand name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Value *</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
              min={1}
              className="w-full px-4 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Value in USD"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step={0.01}
              className="w-full px-4 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Sale price in USD"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Stock *</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              className="w-full px-4 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Stock quantity"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
