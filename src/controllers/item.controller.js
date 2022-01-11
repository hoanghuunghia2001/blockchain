const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');

const createItem = catchAsync(async (req, res) => {
  const item = await itemService.createItem(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getAllItem = catchAsync(async (req, res) => {
  const result = await itemService.queryItems();
  res.send(result);
});

const getItemByAccount = catchAsync(async (req, res) => {
  const item = await itemService.getItemByAccount(req.params.ownerId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  res.send(item);
});

const updateItemByAccount = catchAsync(async (req, res) => {
  const item = await itemService.updateItemByAccount(req.params.ownerId, req.body);
  res.send(item);
});


module.exports = {
  createItem,
  getAllItem,
  getItemByAccount,
  updateItemByAccount,
};
