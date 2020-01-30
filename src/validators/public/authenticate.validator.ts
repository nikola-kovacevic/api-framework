import { IsEmail, Matches } from 'class-validator';

export class AuthenticateUser {
  @IsEmail(undefined, { message: 'Email is required!' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])(?!.*\s)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}/,
    { message: 'Password is required, and it has to be complex!' },
  )
  password: string;
}
