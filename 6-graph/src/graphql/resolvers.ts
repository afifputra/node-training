import User from "../models/user";
import bcrypt from "bcryptjs";
import validator from "validator";

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
  const errors: { message: string }[] = [];
  const { email, name, password } = userInput;

  if (!validator.isEmail(email)) {
    errors.push({
      message: "E-Mail is invalid.",
    });
  }

  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    errors.push({
      message: "Password too short!",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    throw error;
  }

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
