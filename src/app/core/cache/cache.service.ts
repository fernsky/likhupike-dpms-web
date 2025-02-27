import { Injectable, Inject } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { ApiConfig, API_CONFIG } from '../api/config/api.config';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<
    string,
    { data: any; timestamp: number; observable: Observable<any> }
  >();

  constructor(@Inject(API_CONFIG) private config: ApiConfig) {}

  get<T>(key: string): Observable<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.config.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.observable as Observable<T>;
  }

  set<T>(key: string, observable: Observable<T>): Observable<T> {
    const shared = observable.pipe(shareReplay(1));
    this.cache.set(key, {
      data: null,
      timestamp: Date.now(),
      observable: shared,
    });
    return shared;
  }

  clear(keyPattern?: RegExp): void {
    if (keyPattern) {
      [...this.cache.keys()]
        .filter((key) => keyPattern.test(key))
        .forEach((key) => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}
