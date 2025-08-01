import api from './client'; // import your configured axios instance

// Simulate payment by updating the order status
export const simulatePayment = async (orderId: string, token: string) => {
    const res = await api.post('/orders/payment', { orderId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  };

// Create a new fake order with cart items
export const createOrder = async (items: any[], total: number, token: string) => {
    const res = await api.post('/orders', {
        orderItems: items.map(item => ({
            name: item.brand,
            qty: item.quantity,
            price: item.price,
            product: item.giftCardId,
        })),
        totalPrice: total,
        isPaid: false,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
