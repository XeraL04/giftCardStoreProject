require('dotenv').config();
const mongoose = require('mongoose');
const GiftCard = require('../models/GiftCard');

const giftCardsData = [
  {
    brand: 'Amazon',
    value: 25,
    imageUrl: 'https://example.com/amazon-25.png',
    stock: 50,
    price: 25
  },
  {
    brand: 'Netflix',
    value: 50,
    imageUrl: 'https://example.com/netflix-50.png',
    stock: 30,
    price: 50
  },
  {
    brand: 'Apple',
    value: 100,
    imageUrl: 'https://example.com/apple-100.png',
    stock: 20,
    price: 95
  },
  {
    brand: 'Spotify',
    value: 15,
    imageUrl: 'https://example.com/spotify-15.png',
    stock: 40,
    price: 15
  },
  {
    brand: 'Google Play',
    value: 35,
    imageUrl: 'https://example.com/googleplay-35.png',
    stock: 25,
    price: 35
  }
];

async function seedGiftCards() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected.');

    // Optional: clear existing gift cards before seeding
    await GiftCard.deleteMany({});
    console.log('Existing gift cards cleared.');

    // Insert sample gift cards
    await GiftCard.insertMany(giftCardsData);
    console.log('Sample gift cards inserted.');

    process.exit();
  } catch (error) {
    console.error('Error seeding gift cards:', error);
    process.exit(1);
  }
}

seedGiftCards();
