import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  Province,
  ProvinceSchema,
  ProvinceSearchParams,
} from '../models/location.model';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class ProvinceService extends BaseApiService {
  constructor(
    private translocoService: TranslocoService,
    protected http: HttpClient,
    @Inject(API_CONFIG) protected config: ApiConfig,
    protected cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchProvinces(params: ProvinceSearchParams): Observable<Province[]> {
    const currentLang = this.translocoService.getActiveLang();
    const fields = params.fields.map((field) => {
      if (field === 'NAME' && currentLang === 'ne') {
        return 'NAME_NEPALI';
      }
      return field;
    });

    return this.createRequest<Province[]>(
      'GET',
      '/provinces/search',
      z.array(ProvinceSchema),
      {
        params: {
          fields: fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.search && { search: params.search }),
        },
        cache: true,
        cacheKey: `provinces:${currentLang}:${JSON.stringify(params)}`,
      }
    ).pipe(
      map((provinces) =>
        provinces.map((province) => ({
          ...province,
          NAME: currentLang === 'ne' ? province.NAME_NEPALI : province.NAME,
        }))
      )
    );
  }
}
