import { Injectable, Inject } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { ApiConfig, API_CONFIG } from '../api/config/api.config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  observable: Observable<T>;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  constructor(@Inject(API_CONFIG) private config: ApiConfig) {}

  get<T>(key: string): Observable<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.config.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.observable;
  }

  set<T>(key: string, observable: Observable<T>): Observable<T> {
    const shared = observable.pipe(shareReplay(1));

    shared.subscribe(data => {
      const entry = this.cache.get(key);
      if (entry) {
        entry.data = data;
      }
    });

    this.cache.set(key, {
      data: null,
      timestamp: Date.now(),
      observable: shared,
    });

    return shared;
  }

  invalidate(pattern: RegExp): void {
    [...this.cache.keys()]
      .filter(key => pattern.test(key))
      .forEach(key => this.cache.delete(key));
  }

  clearAll(): void {
    this.cache.clear();
  }
}
