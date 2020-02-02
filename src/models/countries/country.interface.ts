import { Document } from 'mongoose';

interface CountryName {
  common: string;
  official: string;
  native: Record<string, string>;
}

export interface CountryDto extends Document {
  altSpellings: [string];
  area: number;
  borders: [string];
  callingCode: [string];
  capital: string;
  cca2: string;
  cca3: string;
  ccn3: string;
  cioc: string;
  currency: [string];
  demonym: string;
  landlocked: boolean;
  latlng: [number];
  languages: Record<string, string>;
  name: CountryName;
  region: string;
  subregion: string;
  tld: [string];
}
