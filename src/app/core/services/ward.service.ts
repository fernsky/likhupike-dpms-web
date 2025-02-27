import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  Ward,
  WardSchema,
  LocationSearchParams,
} from '../models/location.model';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class WardService extends BaseApiService {
  constructor(
    protected http: HttpClient,
    @Inject(API_CONFIG) protected config: ApiConfig,
    protected cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchWards(params: LocationSearchParams): Observable<Ward[]> {
    return this.createRequest<Ward[]>(
      'GET',
      '/wards/search',
      z.array(WardSchema),
      {
        params: {
          fields: params.fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.municipalityCode && {
            municipalityCode: params.municipalityCode,
          }),
        },
        cache: true,
        cacheKey: `wards:${JSON.stringify(params)}`,
      }
    );
  }
}
