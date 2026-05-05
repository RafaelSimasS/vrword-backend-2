import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

const cookieExtractor = (req: any): string | null => {
  if (!req) return null;
  if (req.cookies?.accessToken) return req.cookies['accessToken'];
  const cookieHeader = req.headers?.cookie as string | undefined;
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

type CachedUser = { id: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // In-memory short-lived cache to reduce DB round-trips per request
  private readonly _cache = new Map<
    string,
    { user: CachedUser; expiresAt: number }
  >();
  private readonly CACHE_TTL_MS = 60_000; // 1 minute

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<CachedUser | null> {
    const now = Date.now();
    const cached = this._cache.get(payload.sub);

    if (cached && cached.expiresAt > now) {
      return cached.user;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });

    if (!user) return null;

    this._cache.set(payload.sub, {
      user,
      expiresAt: now + this.CACHE_TTL_MS,
    });

    return user;
  }
}
