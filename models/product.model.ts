import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
    },
    quantity: {
      type: Number,
      required:true
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.slug = this.title.toLowerCase().split(" ").join("-");
  next();
});

const ProductModel = models.Product || model("Product", productSchema);
export default ProductModel;
