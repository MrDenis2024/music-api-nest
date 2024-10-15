import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: string[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !this.roles.includes(user.role)) {
      throw new ForbiddenException('You do not have access');
    }

    return true;
  }
}
