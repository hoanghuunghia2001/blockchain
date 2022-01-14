const md5 = require('md5');
/**
 * Convert string to md5 hash
 * @param {Array} array
 * @returns {String}
 */
const hashRequestBody = (identify, description, images) => {
  if (!identify || !description || !images) return;
  let hashImageList = `${md5(identify)}-${md5(description)}`;

  images.forEach((imageUrl) => {
    const hashedImage = md5(imageUrl);
    hashImageList = `${hashImageList}-${hashedImage}`;
  });

  return md5(hashImageList);
};

module.exports = hashRequestBody;
