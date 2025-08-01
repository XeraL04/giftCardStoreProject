export interface GiftCard {
    _id: string; // Mongoose automatically adds a string _id
    brand: string;
    value: number;
    imageUrl?: string; // It's optional based on your schema (no 'required: true')
    stock: number;
    price: number;
    createdAt: string; // Added by `timestamps: true`
    updatedAt: string; // Added by `timestamps: true`
  }