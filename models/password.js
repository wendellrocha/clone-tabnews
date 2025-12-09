import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
  return await bcryptjs.hash(password, rounds);
}

async function compare(providedPassword, storedPasword) {
  return await bcryptjs.compare(providedPassword, storedPasword);
}

const password = {
  hash,
  compare,
};

export default password;
