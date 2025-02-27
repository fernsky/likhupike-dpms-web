import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
  provideTransloco,
  getBrowserLang,
  TRANSLOCO_TRANSPILER,
  DefaultTranspiler,
} from '@jsverse/transloco';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const provideTranslocoConfig = () => [
  provideTransloco({
    config: {
      availableLangs: ['en', 'ne'],
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  }),
  {
    provide: TRANSLOCO_TRANSPILER,
    useClass: DefaultTranspiler,
  },
];
