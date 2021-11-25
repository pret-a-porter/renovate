import is from '@sindresorhus/is';
import { AbstractMigration } from '../base/abstract-migration';

export class BranchPrefixMigration extends AbstractMigration {
  readonly propertyName = 'branchPrefix';

  override run(value): void {
    if (is.string(value) && value.includes('{{')) {
      const templateIndex = value.indexOf(`{{`);
      this.rewrite(value.substring(0, templateIndex));
      this.setHard('additionalBranchPrefix', value.substring(templateIndex));
    }
  }
}
