import * as mongoose from 'mongoose';

export const EventLogSchema = new mongoose.Schema(
  {
    correlation: String,
    client: {
      ip: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true },
    },
    request: {
      url: { type: String, index: true },
      method: String,
      body: mongoose.Schema.Types.Mixed,
      query: mongoose.Schema.Types.Mixed,
      params: mongoose.Schema.Types.Mixed,
      headers: mongoose.Schema.Types.Mixed,
    },
    response: {
      status: Number,
      message: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now, index: true },
    },
    debug: mongoose.Schema.Types.Mixed,
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: '30 days' },
    },
    duration: Number,
  },
  { timestamps: true },
);
