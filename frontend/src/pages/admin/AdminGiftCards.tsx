import { useEffect, useState } from 'react';
import api from '../../api/client';
import AddGiftCardModal from '../../components/admin/AddGiftCardModal';
import EditGiftCardModal from '../../components/admin/EditGiftCardModal';


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
      prev.map(card => (card._id === updatedCard._id ? updatedCard : card))
    );
  }

  async function deleteGiftCard(id: string) {
    if (!window.confirm('Are you sure you want to delete this gift card? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/giftcards/${id}`);
      setGiftCards((prev) => prev.filter((card) => card._id !== id));
      alert('Gift card deleted successfully');
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
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Gift Card Management</h1>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
      >
        + Add Gift Card
      </button>

      {loading && <p>Loading gift cards...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && (
        <div className="overflow-auto">
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300 text-left">Brand</th>
                <th className="p-3 border-b border-gray-300 text-left">Value</th>
                <th className="p-3 border-b border-gray-300 text-left">Price</th>
                <th className="p-3 border-b border-gray-300 text-left">Stock</th>
                <th className="p-3 border-b border-gray-300 text-left">Created At</th>
                <th className="p-3 border-b border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {giftCards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">No gift cards found.</td>
                </tr>
              ) : (
                giftCards.map((card) => (
                  <tr key={card._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300">{card.brand}</td>
                    <td className="p-3 border-b border-gray-300">{card.value}</td>
                    <td className="p-3 border-b border-gray-300">{card.price}</td>
                    <td className="p-3 border-b border-gray-300">{card.stock}</td>
                    <td className="p-3 border-b border-gray-300">
                      {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-3 border-b border-gray-300 space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(card)}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        disabled={deletingId === card._id}
                        onClick={() => deleteGiftCard(card._id)}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                      >
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
