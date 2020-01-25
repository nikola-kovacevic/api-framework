import * as mongoose from 'mongoose';

export const DemoSchema = new mongoose.Schema({
  name: String,
  value: Object,
});
