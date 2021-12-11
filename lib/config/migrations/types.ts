import type { RenovateConfig } from './../types';
export interface MigrationConstructor {
  new (
    originalConfig: RenovateConfig,
    migratedConfig: RenovateConfig
  ): Migration;
}

export interface Migration {
  readonly propertyName: string | RegExp;
  run(value: unknown, key: string): void;
}
