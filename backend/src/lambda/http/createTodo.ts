import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from "../../utils/logger";
import { createTodo } from '../../businessLogic/todos'
import logStatements from "../../log-statements";
import { getUserId } from "../utils";
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.create.name);

    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body);
      logger.info(logStatements.create.success, newTodo);
      const userId = getUserId(event);
      const result = await createTodo(newTodo, userId);

      return {
        statusCode: 201,
        body: JSON.stringify({ item: result })
      }
    } catch (error) {
      logger.error(logStatements.create.error, error);

      return {
        statusCode: 500,
        body: logStatements.create.error
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
  )