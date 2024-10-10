
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  phone: string;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const UserProfile: Model<User> = mongoose.models.UserProfile || mongoose.model<User>('UserProfile', UserSchema);

export default UserProfile;
