import * as mongoose from 'mongoose';

export const PlatformSchema = new mongoose.Schema({
  name: String,
  redirectUrl: String,
});
