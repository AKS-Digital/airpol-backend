import bcrypt from "bcrypt";

export const encodePassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const decodePassword = (password: string, dbPassword: string) => {
  return bcrypt.compare(password, dbPassword);
};
