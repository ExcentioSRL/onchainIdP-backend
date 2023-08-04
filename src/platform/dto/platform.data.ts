import { Document } from 'mongoose';

export interface Platform extends Document {
  readonly name: string;
  readonly redirectUrl: string;
}
