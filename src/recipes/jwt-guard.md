# JWT Guard
Most modern web applications allow for the use of JWT's. If you are not familiar with those, you can find more information at [jwt.io](https://jwt.io/). 

Using [Guards](https://danet.land/overview/guards.html), we can quite easily implement JWT authorization. The below logic is also heavily based on the [official Deno documentation](https://docs.deno.com/examples/creating_and_verifying_jwt/) about JWT's. We will be using the Jose library here. 

In this example, the JWT is generated using a secret (with the HMAC algorithm) which is known by the client and the server. This code can easily be changed to a private and public key option (RSA and ECDSA). Please see the Jose documentation on how to do this. The private and public key option is the preferred method, as a leaked secret on the client side forces the server side to also change the secret - a leaked public key does not force the server to change the private key. But for instruction purposes, we are showing the HMAC version because that is conceptually easier to start with. 

```typescript jwt-auth-guard.ts

import { Injectable, AuthGuard, ExecutionContext } from 'jsr:@danet/core';
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";

// Normally, this secret is stored on a different/save location
const secret = new TextEncoder().encode("secret-that-no-one-knows");

// This code can be used to locally get a JWT token to test with
// The resulting log can be added to this test call:
//   curl -H "Authorization: Bearer <JWT token here>" localhost:3000/todo
// Ideally, you would use an Identity Provider to generate the JWT
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
