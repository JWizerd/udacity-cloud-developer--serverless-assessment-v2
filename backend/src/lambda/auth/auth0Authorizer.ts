import 'source-map-support/register'
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { AuthService } from '../../helpers/authService';
import logStatements from '../../log-statements'
import { createLogger } from '../../utils/logger'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  const logger = createLogger(logStatements.authorizer.name);

  try {
    const service = new AuthService();
    const decodedToken = await service.verifyToken(event.authorizationToken);

    logger.info(logStatements.authorizer.success, decodedToken)

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error(logStatements.authorizer.error, e)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}