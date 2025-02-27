import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  District,
  DistrictSchema,
  LocationSearchParams,
} from '../models/location.model';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class DistrictService extends BaseApiService {
  constructor(
    private translocoService: TranslocoService,
    protected http: HttpClient,
    @Inject(API_CONFIG) protected config: ApiConfig,
    protected cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchDistricts(params: LocationSearchParams): Observable<District[]> {
    const currentLang = this.translocoService.getActiveLang();
    const fields = params.fields.map((field) => {
      if (field === 'NAME' && currentLang === 'ne') {
        return 'NAME_NEPALI';
      }
      return field;
    });

    return this.createRequest<District[]>(
      'GET',
      '/districts/search',
      z.array(DistrictSchema),
      {
        params: {
          fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.search && { search: params.search }),
          ...(params.provinceCode && { provinceCode: params.provinceCode }),
        },
        cache: true,
        cacheKey: `districts:${currentLang}:${JSON.stringify(params)}`,
      }
    ).pipe(
      map((districts) =>
        districts.map((district) => ({
          ...district,
          NAME: currentLang === 'ne' ? district.NAME_NEPALI : district.NAME,
        }))
      )
    );
  }
}
