import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

export interface User extends Document {
  name: string;
  email: string;
  type: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your email"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter your email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your email"],
      minlength: [6, "Password must be atleast of 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before storing

userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare entered password

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<User> = mongoose.model("User", userSchema);

export default userModel;
