
import * as S3 from "aws-sdk/clients/s3";
import { getS3Client } from "../utils/s3-get-client";;

export class AttachmentsAccess {
  constructor(
    private readonly s3: S3 = getS3Client(),
    private readonly bucketName: string = process.env.TODO_ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
  ) { }

  getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    });
  }

  async delete(todoId: string) {
    return this.s3.deleteObject({
      Key: todoId,
      Bucket: this.bucketName
    }).promise();
  }
}