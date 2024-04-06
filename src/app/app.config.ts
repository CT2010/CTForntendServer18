// app.config.ts

import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
type EnvironmentProviders = any; // Replace 'any' with the actual type // khắc phục lỗi truyền HTtp no provider trong trang login

const environmentProviders: EnvironmentProviders =
  importProvidersFrom(HttpClientModule); // khắc phục lỗi truyền HTtp no provider trong trang login
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      environmentProviders // khắc phục lỗi truyền HTtp no provider trong trang login
      //  provideAnimationsAsync(),
    ),
  ],
};

// khắc phục lỗi truyền HTtp no provider trong trang login
// bổ sung thêm 3 dòng code mới như sau:
// import { provideRouter } from '@angular/router';
// import { importProvidersFrom } from '@angular/core';
// type EnvironmentProviders = any; // Replace 'any' with the actual type // khắc phục lỗi truyền HTtp no provider trong trang login
// const environmentProviders: EnvironmentProviders = importProvidersFrom(HttpClientModule); providers: [
//   provideRouter(
//       environmentProviders, // khắc phục lỗi truyền HTtp no provider trong trang login
//     ),
