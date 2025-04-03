import {
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectRequest,
  S3Client,
} from "@aws-sdk/client-s3";
import { ImageDao } from "../ImageDAO";
import { ImageEntity } from "../../entities/ImageEntity";

class ImageS3DAO implements ImageDao {
  readonly bucketName = "cs340-tweeter-alvey";

  async putImage(image: ImageEntity): Promise<ImageEntity> {
    let decodedImageBuffer: Buffer = Buffer.from(image.imageBytes, "base64");
    const s3Params = {
      Bucket: this.bucketName,
      Key: `user_images/${image.userAlias}`,
      Body: decodedImageBuffer,
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client();
    try {
      await client.send(c);
      const imageUrl = `https://${
        this.bucketName
      }.s3.${"us-west-2"}.amazonaws.com/user_images/${image.userAlias}`;

      const updatedImage: ImageEntity = {
        userAlias: image.userAlias,
        imageBytes: image.imageBytes,
        url: imageUrl,
      };
      return updatedImage;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}

export default ImageS3DAO;
