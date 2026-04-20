const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getOtpExpiryDate = () => {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

module.exports = {
  generateOtp,
  getOtpExpiryDate,
};
