import { ImageEntity } from "../entities/ImageEntity";

export interface ImageDao {
  putImage(image: ImageEntity): Promise<ImageEntity>;
}
