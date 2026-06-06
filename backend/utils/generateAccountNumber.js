const crypto = require("crypto")

const generateAccountNumber = () => {
  // Get epoch timestamp in milliseconds (e.g., 1718223847123)
  const timestamp = Date.now().toString();

  // Add a 4-digit secure random suffix to handle simultaneous requests
  let randomSuffix = "";
  while (randomSuffix.length < 5) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < 250) {
      randomSuffix += (byte % 10).toString();
    }
  }

  return randomSuffix; //17807312887842689
};

module.exports = { generateAccountNumber };
