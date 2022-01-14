const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { toJSON, paginate } = require('./plugins');

const itemSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    itemAddress: {
      type: String,
      required: true,
    },
    identify: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    history: {
      type: Array,
      default: [],
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

/**
 * @typedef User
 */
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
