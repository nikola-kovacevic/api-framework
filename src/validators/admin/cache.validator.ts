import { IsBoolean } from 'class-validator';

export class ManageCache {
  @IsBoolean({ message: 'Enabled property is required, and it should be in boolean format' })
  enabled: boolean;
}
