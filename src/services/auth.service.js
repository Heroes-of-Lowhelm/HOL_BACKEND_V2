const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const codeService = require('./code.service');
const Code = require('../models/code.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const confirmLogin = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await userService.updateUserById(user.id, { isLoggedIn: true });
};

const loginUserWithGoogle = async (email, name) => {
  const user = await userService.getUserByEmail(email);
  if (!user || user.name !== name || !user.isGoogle) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect user information');
  }
  return user;
};

/**
 * Logout
 * @param {string} email
 * @returns {Promise}
 */
const logout = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.isGoogle) {
    await userService.updateUserById(user.id, { isLoggedIn: false, isEmailVerified: false });
  } else {
    await userService.updateUserById(user.id, { isLoggedIn: false });
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {{code, email}} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await codeService.verifyToken(resetPasswordToken);
    const user = await userService.getUserByEmail(resetPasswordTokenDoc.email);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Code.deleteOne({ email: user.email });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {object} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await codeService.verifyToken(verifyEmailToken);
    const user = await userService.getUserByEmail(verifyEmailTokenDoc.email);
    if (!user) {
      throw new Error();
    }
    await Code.deleteOne({ email: user.email });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginUserWithGoogle,
  confirmLogin,
};
