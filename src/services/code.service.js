const httpStatus = require('http-status');
const { Code } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a code
 * @param {Object} codeParam
 * @returns {Promise<User>}
 */

const getCodeByEmail = async (email) => {
  return Code.findOne({ email });
};

const updateCodeByEmail = async (email, updateBody) => {
  const code = await getCodeByEmail(email);
  if (!code) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(code, updateBody);
  await code.save();
  return code;
};

const createCode = async (codeParam) => {
  if (await Code.isEmailTaken(codeParam.email)) {
    const updatedCode = await updateCodeByEmail(codeParam.email, codeParam);
    return updatedCode;
  }
  return Code.create(codeParam);
};

const verifyToken = async (verifyEmailToken) => {
  const codeDoc = await Code.findOne({ email: verifyEmailToken.email });
  if (!codeDoc) {
    throw new Error('Code not found');
  }
  return codeDoc;
};

module.exports = {
  createCode,
  verifyToken,
};
