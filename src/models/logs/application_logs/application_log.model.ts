import * as mongoose from 'mongoose';

export const ApplicationLogSchema = new mongoose.Schema({
  level: String,
  message: String,
  hostname: String,
  meta: {},
  timestamp: { type: Date, default: Date.now },
});
