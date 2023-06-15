import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saultRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saultRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
