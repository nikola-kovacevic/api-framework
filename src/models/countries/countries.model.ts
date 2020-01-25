import * as mongoose from 'mongoose';

export const CountriesSchema = new mongoose.Schema({
  altSpellings: [String],
  area: Number,
  borders: [String],
  callingCode: [String],
  capital: String,
  cca2: String,
  cca3: String,
  ccn3: String,
  cioc: String,
  currency: [String],
  demonym: String,
  landlocked: Boolean,
  latlng: [Number],
  languages: Object,
  name: Object,
  region: String,
  subregion: String,
  tld: [String],
});
