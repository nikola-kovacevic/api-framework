import { IsMongoId } from 'class-validator';

export class ResourceId {
  @IsMongoId({ message: 'ID is required, and it has to in valid Mongo ObjectId format!' })
  id: string;
}
