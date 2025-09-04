import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';

export default function ProofViewer() {
  const { orderId } = useParams();
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    api.get(`/orders/${orderId}/proof`)
      .then(res => {
        setProofUrl(res.data.paymentProof?.url || null);
        setTransactionId(res.data.paymentProof?.transactionId || null);
      })
      .catch(err => {
        console.error(err);
        setProofUrl(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const backendURL = 'http://localhost:5000'; // Adjust for production!
  const displayUrl = proofUrl?.startsWith('/uploads')
    ? backendURL + proofUrl
    : proofUrl;

  if (loading) return <p className="p-8 text-center">Loading proof...</p>;
  if (!proofUrl) return <p className="p-8 text-center text-red-600">No payment proof found for this order.</p>;

  const isPDF = proofUrl.toLowerCase().endsWith('.pdf');

  return (
    <main className="max-w-3xl xl:max-w-4xl mx-auto mt-12 px-4 sm:px-6 bg-white rounded-3xl p-4 sm:p-6 shadow border">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Payment Proof</h1>
      {transactionId && (
        <p className="mb-4 text-sm text-center"><strong>Transaction ID:</strong> {transactionId}</p>
      )}

      <div className="w-full flex justify-center bg-gray-50 rounded-2xl border shadow mb-6 p-2">
        {isPDF ? (
          <iframe
            src={displayUrl ?? ''}
            title="Payment Proof PDF"
            className="w-full h-[60vh] sm:h-[75vh] border rounded"
          />
        ) : (
          <img
            src={displayUrl ?? ''}
            alt="Payment Proof"
            className="max-w-full max-h-[60vh] sm:max-h-[75vh] rounded-lg shadow object-contain"
          />
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href={displayUrl ?? ''}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium transition"
        >
          Open Original File in New Tab
        </a>
      </div>
    </main>
  );
}
