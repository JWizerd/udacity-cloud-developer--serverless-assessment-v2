import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import logStatements from '../../log-statements';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from "../../businessLogic/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.generateUploadUrl.name);
    try {
      const todoId = event.pathParameters.todoId;
      const url = createAttachmentPresignedUrl(todoId);
      logger.info(logStatements.generateUploadUrl.success, url);

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      };
    } catch (error) {
      logger.error(logStatements.generateUploadUrl.error, error)

      return {
        statusCode: 500,
        body: logStatements.generateUploadUrl.error
      }
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
