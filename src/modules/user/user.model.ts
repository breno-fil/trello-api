export class User {
  id: number;
  username: string;
  email: string;
  password?: string;
  token?: string;
  newPassword?: string;
  
  constructor(
    id: number,
    username: string,
    email: string,
    password?: string,
    token?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.token = token;
  }
}
