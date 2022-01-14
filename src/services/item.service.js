/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Item } = require('../models');
const ApiError = require('../utils/ApiError');
const hashRequestBody = require('../utils/hashRequestBody');

/**
 * Create a Item
 * @param {Object} userBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {
  const hashedString = hashRequestBody(itemBody.identify, itemBody.description, itemBody.images);
  itemBody.history = [hashedString];
  return Item.create(itemBody);
};

const queryItems = async () => {
  const results = await Item.find({ state: { $ne: 2 } });
  return results;
};

const getAllItemById = async (id) => {
  return Item.findById(id);
};

const getItemByAccount = async (ownerId) => {
  return Item.findOne({ ownerId });
};

const getItemById = async (itemId) => {
  return Item.findOne({ _id: itemId });
};

const checkStateChange = (oldState, newState) => {
  if (oldState === 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This item was deliveried!');
  }

  if (newState === oldState) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Nothing change to update!');
  }

  if (newState < oldState) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot down state!');
  }

  if (newState < 0 || newState > 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid state');
  }

  if (newState === oldState + 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot skip 2 step!');
  }

  return oldState + 1;
};

const updateItemByAccount = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  // CHECK IS VALID STATE?
  const newState = checkStateChange(item.state, updateBody.state);

  // ONLY CHANGE STATE
  if (!updateBody.identify && !updateBody.description && !updateBody.images && updateBody.state) {
    console.log('ONLY CHANGE STATE');
    const returnValue = await Item.findOneAndUpdate(
      { _id: itemId },
      { state: newState },
      { new: true, useFindAndModify: false }
    );
    return returnValue;
  }

  // CASE: ONLY UPDATE INFOS
  if (
    (updateBody.identify || updateBody.description || updateBody.images) &&
    (!updateBody.state || updateBody.state === item.state)
  ) {
    console.log('ONLY UPDATE INFOS');
    // GENERATE NEW HASH STRING
    const hashedString = hashRequestBody(
      updateBody.identify || item.identify,
      updateBody.description || item.description,
      updateBody.images || item.images
    );
    // CHECK HISTORY LAST STRING DUPLICATE
    if (item.history.slice(-1)[0] === hashedString) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Nothing change to update!');
    }
    const returnValue = await Item.findOneAndUpdate(
      { _id: itemId },
      {
        identify: updateBody.identify,
        description: updateBody.description,
        images: updateBody.images,
        $push: { history: hashedString },
      },
      { new: true, useFindAndModify: false }
    );
    return returnValue;
  }

  console.log('UPDATE ALL');
  // GENERATE NEW HASH STRING
  const hashedString = hashRequestBody(
    updateBody.identify || item.identify,
    updateBody.description || item.description,
    updateBody.images || item.images
  );
  // CHECK HISTORY LAST STRING DUPLICATE
  if (item.history.slice(-1)[0] === hashedString) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nothing change to update!');
  }
  const returnValue = await Item.findOneAndUpdate(
    { _id: itemId },
    {
      identify: updateBody.identify,
      description: updateBody.description,
      images: updateBody.images,
      state: newState,
      $push: { history: hashedString },
    },
    { new: true, useFindAndModify: false }
  );
  return returnValue;
};

module.exports = {
  createItem,
  queryItems,
  getAllItemById,
  getItemByAccount,
  updateItemByAccount,
};
