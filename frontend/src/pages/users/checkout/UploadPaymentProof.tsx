import { useState } from 'react';
import api from '../../../api/client';
import { Link } from 'react-router-dom';

interface UploadPaymentProofProps {
  orderId: string;
  currentProofUrl?: string;
  currentTransactionId?: string;
  onProofUploaded?: () => void;
}

export default function UploadPaymentProof({
  orderId,
  currentProofUrl,
  currentTransactionId,
  onProofUploaded,
}: UploadPaymentProofProps) {
  const [transactionId, setTransactionId] = useState(currentTransactionId || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !transactionId.trim()) {
      setError('Please upload a proof file or enter a transaction ID.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      if (file) formData.append('proof', file);
      formData.append('transactionId', transactionId.trim());

      const response = await api.post(`/orders/upload-proof/${orderId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);

      setSuccess(true);
      setFile(null);
      setTransactionId('');
      if (onProofUploaded) onProofUploaded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg p-6 bg-white rounded-3xl shadow-md border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Upload Payment Proof</h2>

      {currentProofUrl && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded">
          Current uploaded proof:{' '}
          <Link
            to={`/proofs/${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-900"
          >
            View File
          </Link>
        </div>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">Payment proof uploaded successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="proofFile" className="block font-medium text-gray-700 mb-1">
            Upload Screenshot / Proof (JPG, PNG, PDF, max 8MB)
          </label>
          <input
            id="proofFile"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow hover:shadow-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Submit Proof'}
        </button>
      </form>
    </div>
  );
}
