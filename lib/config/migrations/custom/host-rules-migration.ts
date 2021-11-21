import type { HostRule } from '../../../types';
import { AbstractMigration } from '../base/abstract-migration';

export class HostRulesMigration extends AbstractMigration {
  readonly propertyName = 'hostRules';

  override run(value): void {
    const newHostRules: HostRule[] = value.map((rule) => {
      const newRule: Record<string, unknown> = { ...rule };
      newRule.hostType ??= newRule.platform;
      newRule.matchHost ??=
        newRule.endpoint ||
        newRule.host ||
        newRule.baseUrl ||
        newRule.hostName ||
        newRule.domainName;

      delete newRule.platform;
      delete newRule.endpoint;
      delete newRule.host;
      delete newRule.baseUrl;
      delete newRule.hostName;
      delete newRule.domainName;

      return newRule;
    });

    this.rewrite(newHostRules);
  }
}
