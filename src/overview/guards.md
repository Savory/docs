---
order: 90
---

A guard is a class annotated with the `@Injectable()` decorator, which implements the `AuthGuard` interface.

Guards have a **single responsibility**. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. This is often referred to as **authorization**.

## Authorization guard

As mentioned, **authorization** is a great use case for Guards because specific routes should be available only when the caller (usually a specific authenticated user) has sufficient permissions. The `AuthGuard` that we'll build now assumes an authenticated user (and that, therefore, a token is attached to the request headers). It will extract and validate the token, and use the extracted information to determine whether the request can proceed or not.

```typescript simple-auth-guard.ts

import { Injectable, AuthGuard, ExecutionContext } from 'jsr:@danet/core';

@Injectable()
export class SimpleAuthGuard implements AuthGuard {
    validateRequest(authHeader:string): boolean {
      // Can be tested using: curl -u user:my-secret-password localhost:3000/todo
      return authHeader === "Basic dXNlcjpteS1zZWNyZXQtcGFzc3dvcmQ=";
    }

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> {
      const authHeader = context.req.raw.headers.get('authorization');
      return this.validateRequest(authHeader);
    }
}
```

The logic inside the `validateRequest()` function can be as simple or sophisticated as needed. The main point of this example is to show how guards fit into the request/response cycle.

Every guard must implement a `canActivate()` function. This function should return a boolean, indicating whether the current request is allowed or not. It can return the response either synchronously or asynchronously via a `Promise`. Danet uses the return value to control the next action:

- if it returns `true`, the request will be processed.
- if it returns `false`, Danet will deny the request.

## Binding guards

Like pipes and exception filters, guards can be **controller-scoped**, method-scoped, or global-scoped. Below, we set up a controller-scoped guard using the `@UseGuard()` decorator. This decorator may take a single argument, or a comma-separated list of arguments. This lets you easily apply the appropriate set of guards with one declaration.

```typescript todo.controller.ts
@Controller('todo')
@UseGuard(SimpleGuard)
export class TodoController {}
```

The construction above attaches the guard to every handler declared by this controller. If we wish the guard to apply only to a single method, we apply the `@UseGuard()` decorator at the **method level**.

Global guards are used across the whole application, for every controller and every route handler. You can set up a global guard using the following:

```typescript app.module.ts
import { Module, AuthGuard } from 'jsr:@danet/core';

@Module({
  providers: [
    new TokenInjector(SimpleGuard, GLOBAL_GUARD)
  ],
})
export class AppModule {}
```

## JWT Example
Most modern web applications allow for the use of JWT's. If you are not familiar with those, you can find more information at [jwt.io](https://jwt.io/). 

The above example of a SimpleGuard can easily be converted to a JWT guard as follows: 

```typescript jwt-auth-guard.ts

import { Injectable, AuthGuard, ExecutionContext } from 'jsr:@danet/core';
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";

// Normally, this secret is stored on a different/save location
const secret = new TextEncoder().encode("secret-that-no-one-knows");

// This code can be used to locally get a JWT token to test with
// The resulting log can be added to this test call:
//   curl -H "Authorization: Bearer <JWT token here>" localhost:3000/todo
// The below could should be implemented on the client side
async function createJWT(payload: JWTPayload): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);
  
    return jwt;
}

console.log(await createJWT({
    "sub": "1234567890",
    "name": "Danet Client",
    "iat": 1516239022
}))

@Injectable()
export class JwtAuthGuard implements AuthGuard {
    async verifyJWT(token: string): Promise<JWTPayload | null> {
        try {
          const { payload } = await jwtVerify(token, secret);
          console.log("JWT is valid:", payload);
          return payload;
        } catch (error) {
          console.error("Invalid JWT:", error);
          return null;
        }
    }
    
    async validateRequest(authHeader): Promise<boolean> {
        const token = authHeader.replace('Bearer ','')
        const verifiedPayload = await this.verifyJWT(token);
        if(!verifiedPayload) {
            return false
        }
        console.log("Verified Payload:", verifiedPayload);
        return true
    }
    
    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const authHeader = context.req.raw.headers.get('authorization');
        return this.validateRequest(authHeader);
    }
}
```
For verifying the JWT, we are using the Jose library. The above example and code was directly taken from the [Deno Docs](https://docs.deno.com/examples/creating_and_verifying_jwt/). 

In this example, the JWT is generated using a secret (HS256 and others) which is known by the client and the server. This code can easily be changed to a private and public key option (RS256 and others). Please see the Jose documentation on how to do this. The private and public key option is the preferred method, as a leaked secret on the client side forces the server side to also change the secret - a leaked public key does not force the server to change the private key. 

