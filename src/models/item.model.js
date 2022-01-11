const { object } = require('joi');
const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

const itemSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
    },
    itemAddress: {
      type: String,
    },
    identify: {
      type: String,
    },
    state: {
      type: Number,
    },
    price: {
      type: Number,
    },
    images: {
      type: Array,
    },
    description: {
      type: String,
    },
    status: {
      type: Object,
    },
    _destroy: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
// itemSchema.plugin(toJSON);
// itemSchema.plugin(paginate);


/**
 * @typedef User
 */
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
