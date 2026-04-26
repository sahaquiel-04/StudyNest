// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface StorageResult {
  key: string;
  value: string;
  shared: boolean;
}

interface StorageListResult {
  keys: string[];
  prefix?: string;
  shared: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this._initPromise = this.init();
  }

  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ensureInitialized() {
    await this._initPromise;
  }

  async get(key: string, shared: boolean = false): Promise<StorageResult | null> {
    await this.ensureInitialized();
    try {
      const value = await this._storage?.get(key);
      if (value === null || value === undefined) {
        throw new Error('Key not found');
      }
      return {
        key,
        value,
        shared
      };
    } catch (error) {
      throw error;
    }
  }

  async set(key: string, value: string, shared: boolean = false): Promise<StorageResult | null> {
    await this.ensureInitialized();
    try {
      await this._storage?.set(key, value);
      return {
        key,
        value,
        shared
      };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  }

  async delete(key: string, shared: boolean = false): Promise<{ key: string; deleted: boolean; shared: boolean } | null> {
    await this.ensureInitialized();
    try {
      await this._storage?.remove(key);
      return {
        key,
        deleted: true,
        shared
      };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  }

  async list(prefix?: string, shared: boolean = false): Promise<StorageListResult | null> {
    await this.ensureInitialized();
    try {
      const allKeys = await this._storage?.keys() || [];
      const filteredKeys = prefix 
        ? allKeys.filter(key => key.startsWith(prefix))
        : allKeys;
      
      return {
        keys: filteredKeys,
        prefix,
        shared
      };
    } catch (error) {
      console.error('Storage list error:', error);
      return null;
    }
  }

  async clear() {
    await this.ensureInitialized();
    await this._storage?.clear();
  }
}