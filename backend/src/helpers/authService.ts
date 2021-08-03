import { JwtPayload } from '../auth/JwtPayload';
import { Jwt } from "../auth/Jwt";
import 'source-map-support/register'
import { JwksClient } from 'jwks-rsa';
import * as JwtManager from "jsonwebtoken";
import logStatements from "../log-statements";

export class AuthService {
  constructor(
    private readonly jwtManager = JwtManager,
    private readonly jwksClient: JwksClient = new JwksClient({
      jwksUri: process.env.AUTH0_JWKS_ENDPOINT
    })
  ) {}

  async verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = this.getToken(authHeader);
    const tokenDecoded = this.decodeToken(token);
    const signingKey = await this.getSigningKey(tokenDecoded);
    return this.jwtManager.verify(
      token,
      signingKey
    ) as JwtPayload;
  }

  decodeToken(token: string) {
    const jwt = this.jwtManager.decode(token, { complete: true }) as Jwt;
    if (!jwt.header.kid) throw new Error(logStatements.decodeToken.error.noKid);
    return jwt;
  }

  async getSigningKey(jwt: Jwt): Promise<string> {
    const signingKey = await this.jwksClient.getSigningKey(jwt.header.kid);
    if (!signingKey) throw new Error(logStatements.getSigningKey.error.noAssocKey);
    return signingKey.getPublicKey();
  }

  getToken(authHeader: string): string {
    if (!authHeader) throw new Error(logStatements.getToken.error.noheader)

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      throw new Error(logStatements.getToken.error.invalidHeader)
    }
    const split = authHeader.split(' ')
    const token = split[1]

    return token
  }
}