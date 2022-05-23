import is from '@sindresorhus/is';
import { getOptionType } from '../../options';
import type { RenovateConfig } from '../../types';
import { AbstractMigration } from './abstract-migration';

export class MigrationByValueType extends AbstractMigration {
  override readonly propertyName: string;

  constructor(
    propertyName: string,
    originalConfig: RenovateConfig,
    migratedConfig: RenovateConfig
  ) {
    super(originalConfig, migratedConfig);
    this.propertyName = propertyName;
  }

  override run(value: unknown): void {
    const type = getOptionType(this.propertyName);

    switch (type) {
      case 'object':
        if (is.boolean(value)) {
          this.rewrite({ enabled: value });
        }
        break;

      case 'boolean':
        if (value === 'true') {
          this.rewrite(true);
        } else if (value === 'false') {
          this.rewrite(false);
        }
        break;

      case 'string':
        if (Array.isArray(value) && value.length === 1) {
          const firstItem = value[0];
          if (typeof firstItem === 'string') {
            this.rewrite(firstItem);
          }
        }
        break;
    }
  }
}
