import { model, models, Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Category name is required'],
    },
    product_name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    product_image: {
      type: String,
      required: [true, 'Product image is required'],
    },
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', ProductSchema);

export default Product;
