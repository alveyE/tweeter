import { User, UserDto } from "tweeter-shared";
import bcrypt from "bcryptjs";
import ImageS3DAO from "../dao/dao-classes/ImageS3";
import { ImageEntity } from "../entities/ImageEntity";
import crypto from "crypto";
import { UserDynamoDBDao } from "../dao/dao-classes/UserDynamoDB";
import { UserEntity } from "../entities/UserEntity";
import { AuthTokenEntity } from "../entities/AuthTokenEntity";
import { UserDao } from "../dao/UserDAO";
import { Service } from "./Service";

export class UserService extends Service {
  private imageDao: ImageS3DAO;
  private userDao: UserDao;

  constructor() {
    super();
    this.imageDao = new ImageS3DAO();
    this.userDao = new UserDynamoDBDao();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    const user = await this.userDao.getUser(alias);
    if (user === null || user === undefined) {
      throw new Error("Invalid alias or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = crypto.randomBytes(32).toString("hex");
      const authTokenEntity = new AuthTokenEntity(alias, token, Date.now());
      await this.authTokenDao.putAuthToken(authTokenEntity);
      const userDto = this.entityToDto(user);
      return [userDto, token];
    }
    throw new Error("Invalid alias or password");

    // TODO: Replace with the result of calling the server
    //return this.getFakeData("Invalid alias or password");
  }

  public async logout(token: string): Promise<void> {
    await this.authTokenDao.deleteAuthToken(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const imageEntity: ImageEntity = {
      userAlias: alias,
      imageBytes: userImageBytes,
    };
    const imageUrl = (await this.imageDao.putImage(imageEntity)).url || "";
    const token = crypto.randomBytes(32).toString("hex");

    const authTokenEntity = new AuthTokenEntity(alias, token, Date.now());
    await this.authTokenDao.putAuthToken(authTokenEntity);

    const userEntity: UserEntity = {
      alias: alias,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
    };
    await this.userDao.putUser(userEntity);
    const user = await this.userDao.getUser(alias);
    if (user === null) {
      throw new Error("Invalid registration");
    }
    const userDto = this.entityToDto(userEntity);
    return [userDto, token];

    // TODO: Replace with the result of calling the server
    // return this.getFakeData("Invalid registration");
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    this.ensureTokenValid(token);
    const user = await this.userDao.getUser(alias);

    if (user === null || user === undefined) {
      return null;
    }
    return this.entityToDto(user);
  }

  private entityToDto(entity: UserEntity): UserDto {
    let toDto = new User(
      entity.firstName,
      entity.lastName,
      entity.alias,
      entity.imageUrl
    );
    const userDto = toDto.dto;
    return userDto;
  }
}
