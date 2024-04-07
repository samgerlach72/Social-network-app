import { User, AuthToken, FakeData } from "tweeter-shared";
import { ImageDao } from "../concreteDao/ImageDao";
import { SHA256, enc } from 'crypto-js';
import { UsersDAO } from "../concreteDao/UsersDao";
import { AuthTokenDAO } from "../concreteDao/AuthtokenDao";

export class UserService {
    public async login(
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        const result: [User, string] | null = await new UsersDAO().getUser(alias);
    
        if (result === null) {
          throw new Error("[Bad Request] Invalid alias or password");
        }

        const [user, hashedPassword] = result;
        if (this.verifyPassword(password, hashedPassword)){
          const authtoken: AuthToken = AuthToken.Generate();
          await new AuthTokenDAO().putAuthtoken(authtoken);
          return [user, authtoken];
        }
        else {
          throw new Error("[Bad Request] Invalid alias or password");
        }
    };
    
    public async logout(authToken: AuthToken): Promise<void> {
        // // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        // await new Promise((res) => setTimeout(res, 1000));
        await new AuthTokenDAO().deleteAuthtoken(authToken);
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<[User, AuthToken]> {
        let user = new User(firstName, lastName, alias, await new ImageDao().putImage(alias, Buffer.from(userImageBytes).toString("base64")));
        new UsersDAO().putUser(user, this.hashAndSaltPassword(password));
    
        if (user === null) {
          throw new Error("[Bad Request] Invalid registration");
        }

        const authtoken: AuthToken = AuthToken.Generate();
        await new AuthTokenDAO().putAuthtoken(authtoken);
        return [user, authtoken];
    };

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        await new AuthTokenDAO().validateAuthtoken(authToken);
        const result: [User, string] | null = await new UsersDAO().getUser(alias);
    
        if (result === null) {
          throw new Error("[Bad Request] Invalid alias");
        }
        return result[0]
    };

    public hashAndSaltPassword(password: string): string {
      const salt = this.generateSalt();
      let hashedPassword = salt + password;
    
      for (let i = 0; i < 1000; i++) {
          hashedPassword = SHA256(hashedPassword).toString(enc.Base64);
      }
      
      return `${salt}.${hashedPassword}`;
    }

    private generateSalt(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public verifyPassword(password: string, hashedAndSaltedPassword: string): boolean {
        const [salt, storedHashedPassword] = hashedAndSaltedPassword.split('.');
        let hashedPassword = salt + password;
        
        for (let i = 0; i < 1000; i++) {
            hashedPassword = SHA256(hashedPassword).toString(enc.Base64);
        }

        return hashedPassword === storedHashedPassword;
    }
}