import api from './client';

export type GiftCard = {
  _id: string;
  brand: string;
  value: number;
  imageUrl: string;
  stock: number;
  price: number;
};

export async function fetchGiftCards(): Promise<GiftCard[]> {
  const { data } = await api.get('/giftcards');
  return data;
}