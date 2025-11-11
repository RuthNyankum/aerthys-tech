// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     // ✅ Product basic details
//     name: {
//       type: String,
//       required: [true, "Product name is required"],
//       trim: true,
//     },
//     slug: {
//       type: String,
//       unique: true, // ensures no two products share the same slug
//       lowercase: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Product description is required"],
//     },

//     // ✅ Relationship: Each product belongs to a category
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: [true, "Product category is required"],
//     },

//     // ✅ Brand and pricing
//     brand: {
//       type: String,
//       required: [true, "Product brand is required"],
//     },
//     price: {
//       type: Number,
//       required: [true, "Product price is required"],
//       min: 0,
//     },
//     compareAtPrice: {
//       type: Number,
//       default: null, // Original price for showing discounts
//     },

//     // ✅ Product images
//     images: [
//       {
//         url: {
//           type: String,
//           required: true,
//         },
//         publicId: String, // For Cloudinary
//         alt: String,
//       },
//     ],

//     // ✅ Product variants (e.g., color, size)
//     variants: [
//       {
//         name: String,
//         options: [
//           {
//             value: String,
//             priceModifier: {
//               type: Number,
//               default: 0,
//             },
//             stock: {
//               type: Number,
//               default: 0,
//             },
//             sku: String,
//           },
//         ],
//       },
//     ],

//     // ✅ Technical details or specifications
//     specifications: [
//       {
//         name: String,
//         value: String,
//       },
//     ],

//     // ✅ Stock management
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },
//     lowStockThreshold: {
//       type: Number,
//       default: 10,
//     },

//     // ✅ Customer ratings
//     rating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5,
//     },
//     numReviews: {
//       type: Number,
//       default: 0,
//     },

//     // ✅ Product visibility
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     // ✅ Tags for filtering/search
//     tags: [String],
//   },
//   {
//     timestamps: true,
//   }
// );

// // 🧩 Generate slug from name before saving
// productSchema.pre("save", function (next) {
//   if (this.isModified("name")) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   }
//   next();
// });

// // 🔍 Create text index for faster search
// productSchema.index({ name: "text", description: "text", brand: "text" });

// // ✅ Create and export Product model
// const Product = mongoose.model("Product", productSchema);
// export default Product;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      default: null, // Original price for showing discounts
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String, // For Cloudinary
        alt: String,
      },
    ],
    variants: [
      {
        name: String, // e.g., "Color", "Storage"
        options: [
          {
            value: String, // e.g., "Black", "256GB"
            priceModifier: {
              type: Number,
              default: 0,
            },
            stock: {
              type: Number,
              default: 0,
            },
            sku: String,
          },
        ],
      },
    ],
    specifications: [
      {
        name: String, // e.g., "Screen Size"
        value: String, // e.g., "6.7 inches"
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Index for text search
productSchema.index({ name: "text", description: "text", brand: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
