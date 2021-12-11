import { MigrationsService } from '../migrations-service';

describe('config/migrations/custom/required-status-checks-migration', () => {
  it('should migrate requiredStatusChecks=null to ignoreTests=true', () => {
    const { isMigrated, migratedConfig } = MigrationsService.run({
      requiredStatusChecks: null,
    });

    expect(isMigrated).toBeTrue();
    expect(migratedConfig).toEqual({
      ignoreTests: true,
    });
  });

  it('migrates empty requiredStatusChecks', () => {
    const { isMigrated, migratedConfig } = MigrationsService.run({
      requiredStatusChecks: [],
    });
    expect(isMigrated).toBeTrue();
    expect(migratedConfig).toMatchInlineSnapshot(`Object {}`);
  });
});
