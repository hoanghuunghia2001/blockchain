const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    ownerId: Joi.string().required(),
    itemAddress: Joi.string().required(),
    identify: Joi.string().required().max(128),
    price: Joi.number().unsafe().required(),
    images: Joi.array().required().max(8),
    description: Joi.string().required().max(255),
  }),
};

const getItems = {
  query: Joi.object().keys({
    ownerId: Joi.string(),
    itemAddress: Joi.string(),
    identify: Joi.string(),
    state: Joi.number(),
    price: Joi.number(),
    images: Joi.array(),
    description: Joi.string(),
    status: Joi.object(),
    _destroy: Joi.boolean(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    ownerId: Joi.string(),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      identify: Joi.string(),
      state: Joi.number().min(0).max(2),
      images: Joi.array().max(8),
      description: Joi.string().max(255),
    })
    .min(1),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
