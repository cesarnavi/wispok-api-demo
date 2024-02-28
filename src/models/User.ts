import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  id?: number;
  created_at: Date,
  first_name: string;
  last_name: string;
  birthdate: string;
  phone_number?: string;
  email?: string;
  country?: string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    id:{ type: Number, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {type: String,  unique: true, required: true},
    birthdate: { type: String },
    country: { type: String }
});

export const User = model<IUser>('User', userSchema);

