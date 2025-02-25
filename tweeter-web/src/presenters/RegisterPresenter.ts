import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class RegisterPresenter extends AuthenticationPresenter {
  private imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";
  private _imageUrl: string = "";

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public get imageFileExtension(): string {
    return this._imageFileExtension;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension
      );

      this.navigateTo(user, user, authToken, rememberMe, undefined);
    }, "register user");
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._imageFileExtension = fileExtension;
      }
    } else {
      this._imageUrl = "";
      this.imageBytes = new Uint8Array();
    }
  }
}
