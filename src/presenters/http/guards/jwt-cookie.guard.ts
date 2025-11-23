import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  getAuthenticateOptions(context: ExecutionContext) {
    return { session: false };
  }

  // injeta token vindo de cookie/x-access-token no header Authorization
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    if (!req.headers) req.headers = {};
    if (!req.headers.authorization) {
      const token = req.cookies?.accessToken ?? req.headers['x-access-token'];
      if (token) {
        req.headers.authorization = `Bearer ${token}`;
      }
    }

    // delega para o AuthGuard padrão (passport)
    return super.canActivate(context) as Promise<boolean>;
  }

  // se a autenticação não retornar um user, lança Unauthorized
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
