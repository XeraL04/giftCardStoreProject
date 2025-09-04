import { createPortal } from 'react-dom';
import { ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/solid';

import UploadPaymentProof from '../../pages/users/checkout/UploadPaymentProof';

type PaymentProof = {
  url?: string;
  transactionId?: string;
};

type Order = {
  _id: string;
  giftCard: {
    _id: string;
    brand: string;
    value: number;
    imageUrl?: string;
    price: number;
  } | null;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
  status: string;
  code?: string;

  paymentStatus: 'pending_payment' | 'payment_review' | 'paid' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'baridimob' | 'online';
  paymentProof?: PaymentProof;
};

type OrderDetailModalProps = {
  order: Order | null;
  onClose: () => void;
};

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const showUploadProof =
    ['pending_payment', 'payment_review'].includes(order.paymentStatus) &&
    (order.paymentMethod === 'bank_transfer' || order.paymentMethod === 'baridimob');

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-start md:items-center z-50 px-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-8 w-full max-w-md md:max-w-xl mt-10 md:mt-0 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-slate-900 text-center sm:text-left">
          Order Details
        </h2>

        {order.giftCard ? (
          <>
            {order.giftCard.imageUrl && (
              <img
                src={order.giftCard.imageUrl}
                alt={order.giftCard.brand}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto sm:mx-0 mb-4 rounded-xl bg-gray-100 p-2"
              />
            )}
            <p className="text-center sm:text-left"><strong>Brand:</strong> {order.giftCard.brand}</p>
            <p className="text-center sm:text-left"><strong>Value:</strong> ${order.giftCard.value}</p>
            <p className="text-center sm:text-left mb-4"><strong>Price:</strong> ${order.giftCard.price}</p>
          </>
        ) : (
          <p className="text-gray-500 mb-4 text-center">Gift Card details not available.</p>
        )}

        <p className="text-center sm:text-left"><strong>Quantity:</strong> {order.quantity}</p>
        <p className="text-center sm:text-left"><strong>Total Price:</strong> ${order.totalPrice}</p>
        <p className="text-center sm:text-left">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </p>
        <p className="text-center sm:text-left mb-4"><strong>Purchased At:</strong> {new Date(order.purchasedAt).toLocaleString()}</p>

        {order.code && (
          <p className="mt-3 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
            <span className="font-mono bg-gray-100 px-3 py-1 rounded select-all break-words">{order.code}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.code || '');
                alert('Gift card code copied to clipboard!');
              }}
              className="text-blue-600 hover:text-fuchsia-500 transition focus:outline-none"
              aria-label="Copy gift card code"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </button>
          </p>
        )}

        {showUploadProof && (
          <div className="mt-5 w-full">
            <UploadPaymentProof
              orderId={order._id}
              currentProofUrl={order.paymentProof?.url}
              currentTransactionId={order.paymentProof?.transactionId}
              onProofUploaded={() => {
                alert('Payment proof uploaded! We will review it shortly.');
              }}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
