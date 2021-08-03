import * as AWS from 'aws-sdk';
import * as S3 from 'aws-sdk/clients/s3';
import * as AWSXRay from 'aws-xray-sdk';
export const getS3Client = () => {
  const XAWS = AWSXRay.captureAWS(AWS);
  return new XAWS.S3({
    signatureVersion: 'v4'
  }) as S3;
}