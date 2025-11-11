import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

// Sample categories
const categories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones from top brands",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops for work and gaming",
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones, earbuds, and speakers",
  },
  {
    name: "Wearables",
    slug: "wearables",
    description: "Smartwatches and fitness trackers",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Chargers, cases, and more",
  },
];

// Sample products
const products = [
  {
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description:
      "The ultimate iPhone with A17 Pro chip, ProMotion display, and advanced camera system.",
    brand: "Apple",
    price: 1199,
    compareAtPrice: 1299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1678652395894-4e9e0e0d2f5f?w=500",
        alt: "iPhone 15 Pro Max",
      },
    ],
    specifications: [
      { name: "Screen Size", value: "6.7 inches" },
      { name: "Storage", value: "256GB" },
      { name: "Camera", value: "48MP Main" },
      { name: "Battery", value: "4422 mAh" },
    ],
    stock: 50,
    isFeatured: true,
    tags: ["smartphone", "apple", "premium"],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Flagship Android phone with S Pen, amazing camera, and powerful performance.",
    brand: "Samsung",
    price: 1199,
    compareAtPrice: 1299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        alt: "Samsung Galaxy S24 Ultra",
      },
    ],
    specifications: [
      { name: "Screen Size", value: "6.8 inches" },
      { name: "Storage", value: "256GB" },
      { name: "Camera", value: "200MP Main" },
      { name: "Battery", value: "5000 mAh" },
    ],
    stock: 45,
    isFeatured: true,
    tags: ["smartphone", "samsung", "android"],
  },
  {
    name: 'MacBook Pro 14" M3',
    slug: "macbook-pro-14-m3",
    description:
      "Supercharged by M3 chip with incredible performance and battery life.",
    brand: "Apple",
    price: 1999,
    compareAtPrice: 2199,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        alt: "MacBook Pro 14",
      },
    ],
    specifications: [
      { name: "Processor", value: "Apple M3 Pro" },
      { name: "RAM", value: "18GB" },
      { name: "Storage", value: "512GB SSD" },
      { name: "Display", value: "14.2-inch Liquid Retina XDR" },
    ],
    stock: 30,
    isFeatured: true,
    tags: ["laptop", "apple", "macbook"],
  },
  {
    name: "AirPods Pro (2nd Gen)",
    slug: "airpods-pro-2nd-gen",
    description:
      "Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.",
    brand: "Apple",
    price: 249,
    compareAtPrice: 279,
    images: [
      {
        url: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500",
        alt: "AirPods Pro",
      },
    ],
    specifications: [
      { name: "Type", value: "True Wireless Earbuds" },
      { name: "ANC", value: "Yes" },
      { name: "Battery Life", value: "Up to 6 hours" },
      { name: "Water Resistance", value: "IPX4" },
    ],
    stock: 100,
    isFeatured: false,
    tags: ["audio", "earbuds", "apple"],
  },
  {
    name: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    description:
      "Advanced health features, always-on Retina display, and powerful S9 chip.",
    brand: "Apple",
    price: 399,
    compareAtPrice: 449,
    images: [
      {
        url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
        alt: "Apple Watch Series 9",
      },
    ],
    specifications: [
      { name: "Display", value: "1.9-inch Always-On" },
      { name: "Battery", value: "Up to 18 hours" },
      { name: "Water Resistance", value: "50m" },
      { name: "Health Features", value: "ECG, Blood Oxygen, Heart Rate" },
    ],
    stock: 60,
    isFeatured: true,
    tags: ["wearable", "smartwatch", "apple"],
  },
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    console.log("🗑️  Existing data cleared");

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log("✅ Categories seeded");

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Assign categories to products
    products[0].category = categoryMap["Smartphones"];
    products[1].category = categoryMap["Smartphones"];
    products[2].category = categoryMap["Laptops"];
    products[3].category = categoryMap["Audio"];
    products[4].category = categoryMap["Wearables"];

    // Insert products
    await Product.insertMany(products);
    console.log("✅ Products seeded");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
seedData();
