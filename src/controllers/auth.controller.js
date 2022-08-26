const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, codeService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // verification code generation
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await codeService.createCode({ email: req.body.email, code: verificationCode });
  // Send verification code to user's email
  await emailService.sendVerificationEmail(req.body.email, verificationCode);
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await codeService.createCode({ email: req.body.email, code: verificationCode });
  // Send verification code to user's email
  await emailService.sendVerificationEmail(req.body.email, verificationCode);
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await codeService.createCode({ email: req.body.email, code: verificationCode });
  await emailService.sendResetPasswordEmail(req.body.email, verificationCode);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword({ email: req.body.email, code: req.body.code }, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationCode = catchAsync(async (req, res) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await codeService.createCode({ email: req.body.email, code: verificationCode });
  await emailService.sendVerificationEmail(req.body.email, verificationCode);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendVerificationCode,
};
