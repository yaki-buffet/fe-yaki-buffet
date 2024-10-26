import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { USER_ID } from './user-id.token';
import { parse as cookieParse } from 'cookie';
import crypto from 'node:crypto';
import { REQUEST, RESPONSE_INIT } from '@angular/ssr/tokens';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    {
      provide: USER_ID,
      useFactory: (req: Request, res: ResponseInit) => {
        let id = cookieParse(req.headers.get('Cookie') ?? '')?.app_user_id;
        console.log({ id });
        if (!id) {
          id = crypto.randomUUID();
          console.log(res.headers);
          res.headers ??= {};
          (res.headers as Record<string, string>)['Set-Cookie'] =
            `app_user_id=${id}`;
          console.log(res.headers);
        }
        return id;
      },
      deps: [REQUEST, RESPONSE_INIT],
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
