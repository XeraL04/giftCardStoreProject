export enum PaymentMethod {
    BANK_TRANSFER = 'bank_transfer',
    MOBILE_WALLET = 'mobile_wallet'
  }
  
  export enum OrderStatus {
    PENDING_PAYMENT = 'pending_payment',
    PROOF_UPLOADED = 'proof_uploaded',
    PAYMENT_VERIFIED = 'payment_verified',
    PAYMENT_REUPLOAD_REQUIRED = 'payment_reupload_required',
    CANCELLED = 'cancelled',
    COMPLETE = 'complete'
  }
  
  export interface PaymentProof {
    _id?: string;
    imageUrl: string;
    transactionId?: string;
    notes?: string;
    uploadedAt: string;
  }
  
  export interface Order {
    _id: string;
    user: string;
    items: {
      giftCard: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentProofs?: PaymentProof[];
    paymentDeadline: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CheckoutRequest {
    cartItems: {
      giftCard: string;
      quantity: number;
    }[];
    paymentMethod: PaymentMethod;
  }
  
  export interface CheckoutResponse {
    orderId: string;
    status: OrderStatus;
    paymentInstructions?: string;
  }
  
  export interface UploadProofRequest {
    proofImage: File;
    transactionId?: string;
    notes?: string;
  }
  
  export interface AdminVerifyRequest {
    action: 'verify' | 'reject' | 'cancel';
    notes?: string;
  }
  