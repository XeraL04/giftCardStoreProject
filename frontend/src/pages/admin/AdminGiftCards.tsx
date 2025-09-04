import { useEffect, useState } from 'react';
import api from '../../api/client';
import AddGiftCardModal from '../../components/admin/AddGiftCardModal';
import EditGiftCardModal from '../../components/admin/EditGiftCardModal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

export type GiftCard = {
  _id: string;
  brand: string;
  value: number;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
};

export default function AdminGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null);

  const isModalOpen = isAddModalOpen || !!editingGiftCard; // true if any modal open

  useEffect(() => {
    fetchGiftCards();
  }, []);

  async function fetchGiftCards() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/giftcards');
      setGiftCards(res.data?.giftCards || []);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEditModal(card: GiftCard) {
    setEditingGiftCard(card);
  }

  function handleCloseEditModal() {
    setEditingGiftCard(null);
  }

  function handleUpdateCard(updatedCard: GiftCard) {
    setGiftCards((prev) =>
      prev.map((card) => (card._id === updatedCard._id ? updatedCard : card))
    );
  }

  async function deleteGiftCard(id: string) {
    if (!window.confirm('Are you sure you want to delete this gift card?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/giftcards/${id}`);
      setGiftCards((prev) => prev.filter((card) => card._id !== id));
    } catch (err: any) {
      alert(err.response?.data || 'Failed to delete gift card');
    } finally {
      setDeletingId(null);
    }
  }

  const handleAddCard = (newCard: GiftCard) => {
    setGiftCards((prev) => [newCard, ...prev]);
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6">
      <div
        className={`bg-white/90 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl transition-filter duration-200 ${
          isModalOpen ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-b border-blue-50">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Gift Card Management
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Add Gift Card
          </button>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center py-10 text-gray-600">Loading gift cards...</p>
        )}
        {error && (
          <p className="text-center py-4 text-red-600 font-medium">{error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-fuchsia-50 text-slate-700">
                  <th className="px-3 py-3 text-left">Brand</th>
                  <th className="px-3 py-3 text-left">Value</th>
                  <th className="px-3 py-3 text-left">Price</th>
                  <th className="px-3 py-3 text-left">Stock</th>
                  <th className="px-3 py-3 text-left">Created At</th>
                  <th className="px-3 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {giftCards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 bg-white/50">
                      No gift cards found.
                    </td>
                  </tr>
                ) : (
                  giftCards.map((card, idx) => (
                    <tr
                      key={card._id}
                      className={`${
                        idx % 2 === 0 ? 'bg-white/60' : 'bg-white/40'
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-3 py-3 flex items-center gap-3 max-w-xs whitespace-normal">
                        {card.imageUrl && (
                          <img
                            src={card.imageUrl}
                            alt={card.brand}
                            className="w-8 h-8 object-contain rounded-full ring-2 ring-blue-100"
                          />
                        )}
                        <span className="truncate">{card.brand}</span>
                      </td>
                      <td className="px-3 py-3">{card.value}</td>
                      <td className="px-3 py-3 text-green-600 font-semibold">${card.price}</td>
                      <td className="px-3 py-3">{card.stock}</td>
                      <td className="px-3 py-3">
                        {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-3 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenEditModal(card)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white text-xs font-medium shadow hover:from-blue-600 hover:to-fuchsia-600 transition"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteGiftCard(card._id)}
                          disabled={deletingId === card._id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium shadow hover:from-red-600 hover:to-rose-700 transition disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          {deletingId === card._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddGiftCardModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdded={handleAddCard} />
      {editingGiftCard && (
        <EditGiftCardModal
          isOpen={!!editingGiftCard}
          onClose={handleCloseEditModal}
          giftCard={editingGiftCard}
          onUpdated={handleUpdateCard}
        />
      )}
    </div>
  );
}
