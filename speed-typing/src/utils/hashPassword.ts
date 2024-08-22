import bcrypt from "bcryptjs";

const hashPassword = (password: string) => {
  const hashPassword = bcrypt.hashSync(password);

  return hashPassword;
};

const comparePasswords = (s: string, h: string) => {
  return bcrypt.compareSync(s, h);
};

export { hashPassword, comparePasswords };
