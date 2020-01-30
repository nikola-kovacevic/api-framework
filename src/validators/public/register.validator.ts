import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterUser {
  @IsEmail(undefined, { message: 'Email is required!' })
  email: string;

  @IsString({ message: 'Name is required!' })
  name: string;

  @IsString({ message: 'Name is required!' })
  surname: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])(?!.*\s)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}/,
    { message: 'Password is required, and it has to be complex!' },
  )
  password: string;
}
