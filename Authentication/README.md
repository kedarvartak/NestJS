# Authentication in NestJS with Passport

Authentication is a critical component of most modern web applications, responsible for verifying the identity of a user. NestJS provides a flexible and powerful way to handle authentication by integrating with the popular `Passport` library. This approach allows you to easily implement various authentication strategies, such as JSON Web Tokens (JWT) or OAuth, in a modular and maintainable way.

To get started, you will need to install the necessary packages for authentication, including `@nestjs/passport`, `passport`, and the specific passport strategy you intend to use (e.g., `passport-jwt` for JWTs).

```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install --save-dev @types/passport-jwt
```

The core of the authentication process is the **strategy**. A strategy is a class that contains the logic for authenticating a user. For a JWT strategy, this involves verifying the token's signature and expiration, and then extracting the user's information from the token's payload. This class extends `PassportStrategy` and is typically implemented as an injectable provider, allowing it to be used throughout your application.

Once you have a strategy, you can protect your routes using **Guards**. An `AuthGuard` is a special type of guard that automatically invokes the authentication logic provided by your Passport strategy. When applied to a route, the guard will run before the route handler, and if the user is not authenticated (e.g., they don't provide a valid token), NestJS will automatically return a `401 Unauthorized` response. This allows you to secure your endpoints with a single line of code.

Here is an example of a JWT strategy:

```typescript
// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // Use a secure key in a real application
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

And here is how you would use the `AuthGuard` to protect a route in a controller:

```typescript
// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile() {
    // This route is now protected, and the user's information
    // will be available on the request object (e.g., req.user).
    return { message: 'This is a protected route.' };
  }
}
```

By leveraging NestJS's modular architecture with Passport, you can build secure and robust authentication systems that are easy to maintain and extend. 