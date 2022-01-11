const httpStatus = require('http-status');
const { Item } = require('../models');
const ApiError = require('../utils/ApiError');
const { ownerId } = require('../validations/custom.validation');

/**
 * Create a Item
 * @param {Object} userBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {

  return Item.create(itemBody);
};

const queryItems  = async () => {
  const results = await Item.find({  state: { $ne: 2 }});
  return results;
};

const getAllItemById = async (id) => {
  return Item.findById(id);
};


const getItemByAccount = async (ownerId) => {
  return Item.findOne({ ownerId });
};

const updateItemByAccount = async (ownerId, updateBody) => {
  const Item = await getItemByAccount(ownerId);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  Object.assign(Item, updateBody);
  await Item.save();
  return Item;
};



module.exports = {
  createItem,
  queryItems,
  getAllItemById,
  getItemByAccount,
  updateItemByAccount,
};
