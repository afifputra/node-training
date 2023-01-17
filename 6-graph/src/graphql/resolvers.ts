import User from "../models/user";
import bcrypt from "bcryptjs";

const createUser = async (
  {
    userInput,
  }: {
    userInput: {
      email: string;
      password: string;
      name: string;
    };
  },
  __: any
) => {
  const { email, name, password } = userInput;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User exists already.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    name,
    password: hashedPassword,
  });

  const createdUser = (await user.save()).toJSON();

  return {
    ...createdUser,
  };
};

const resolvers = {
  createUser,
};

export default resolvers;
