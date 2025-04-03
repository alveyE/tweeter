export class AuthTokenEntity {
  alias: string;
  token: string;
  timeStamp: number;

  constructor(alias: string, token: string, timeStamp: number) {
    this.alias = alias;
    this.token = token;
    this.timeStamp = timeStamp;
  }

  isValid(): boolean {
    const oneHourInMillis = 60 * 60 * 1000;
    return Date.now() - this.timeStamp < oneHourInMillis;
  }
}
