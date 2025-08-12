import { useEffect, useState } from 'react';
import api from '../../api/client';
import AddGiftCardModal from '../../components/admin/AddGiftCardModal';
import EditGiftCardModal from '../../components/admin/EditGiftCardModal';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

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

  const isModalOpen = isAddModalOpen || !!editingGiftCard; // <- true if any modal open

  useEffect(() => {
    fetchGiftCards();
  }, []);

  async function fetchGiftCards() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/giftcards');
      setGiftCards(res.data.giftCards || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load gift cards');
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
      alert(err.response?.data?.message || 'Failed to delete gift card');
    } finally {
      setDeletingId(null);
    }
  }

  const handleAddCard = (newCard: GiftCard) => {
    setGiftCards((prev) => [newCard, ...prev]);
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6">
      {/* Page Content */}
      <div className={`bg-white/80 backdrop-blur-md border p-7 border-blue-100 rounded-3xl shadow-xl transition duration-200 ${isModalOpen ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Gift Card Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add Gift Card
          </button>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-gray-500 py-8">Loading gift cards...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-medium py-4">{error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-fuchsia-50">
                  <th className="p-3 text-left font-semibold text-slate-700">Brand</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Value</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Price</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Stock</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Created At</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Actions</th>
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
                      className={`${idx % 2 === 0 ? 'bg-white/60' : 'bg-white/40'} hover:bg-blue-50 transition`}
                    >
                      <td className="p-3 font-medium flex items-center gap-3">
                        {card.imageUrl && (
                          <img
                            src={card.imageUrl}
                            alt={card.brand}
                            className="h-10 w-10 object-contain rounded-full ring-2 ring-blue-100"
                          />
                        )}
                        {card.brand}
                      </td>
                      <td className="p-3">${card.value}</td>
                      <td className="p-3 text-green-600 font-semibold">${card.price}</td>
                      <td className="p-3">{card.stock}</td>
                      <td className="p-3">
                        {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenEditModal(card)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white text-xs shadow hover:from-blue-600 hover:to-fuchsia-600 transition"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          disabled={deletingId === card._id}
                          onClick={() => deleteGiftCard(card._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs shadow hover:from-red-600 hover:to-red-700 transition disabled:opacity-60"
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

      {/* Modals always rendered above */}
      <AddGiftCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleAddCard}
      />
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
