import { IsEmail, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUser {
  @IsOptional()
  @IsEmail(undefined, { message: 'Email is required!' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Name is required!' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Surname is required!' })
  surname: string;

  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])(?!.*\s)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}/,
    { message: 'Password is required, and it has to be complex!' },
  )
  password: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role: string;

  @IsOptional()
  @IsIn([['ACTIVE', 'INACTIVE']])
  status: string;
}
