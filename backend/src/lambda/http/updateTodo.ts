import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { updateTodo } from '../../businessLogic/todos'
import logStatements from '../../log-statements';
import { createLogger } from "../../utils/logger";
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.update.name);
    try {
      const userId = getUserId(event);
      const todoId = event.pathParameters.todoId;
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
      const result = await updateTodo(todoId, updatedTodo, userId);
      logger.info(logStatements.update.success, result);

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } catch (error) {
      logger.error(logStatements.update.error, error);

      return {
        statusCode: 500,
        body: logStatements.update.error
      }
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))

