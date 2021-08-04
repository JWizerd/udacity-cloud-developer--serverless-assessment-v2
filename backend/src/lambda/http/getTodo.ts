import 'source-map-support/register';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from "../../utils/logger";
import { getTodo } from '../../businessLogic/todos'
import logStatements from '../../log-statements';
import { getUserId } from '../utils';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.findOne.name);
    try {
      logger.info(logStatements.findOne.success, event);
      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;
      const todo = await getTodo(userId, todoId);

      return {
        statusCode: 200,
        body: JSON.stringify({ item: todo })
      }
    } catch (error) {
      logger.error(logStatements.findOne.error, error);

      return {
        statusCode: 500,
        body: logStatements.findOne.error
      }
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
