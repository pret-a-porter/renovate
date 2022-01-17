import type fs from 'fs';
import type { PathLike } from 'fs';
import callsite from 'callsite';
import { DirectoryJSON, fs as memfs, vol } from 'memfs';
import upath from 'upath';

const realFs = jest.requireActual<typeof fs>('fs');

/**
 * Class to work with in-memory file-system
 */
export class Fixtures {
  /**
   * Returns content from fixture file from __fixtures__ folder
   * @param name name of the fixture file
   * @param fixturesRoot is an optional, by default is current test folder
   * @returns
   */
  static get(name: string, fixturesRoot = '.'): string {
    return realFs.readFileSync(
      upath.resolve(Fixtures.getPathToFixtures(fixturesRoot), name),
      {
        encoding: 'utf-8',
      }
    );
  }

  /**
   * Adds files from a flat json object to the file-system
   * @param json flat object
   * @param cwd is an optional string used to compute absolute file paths, if a file path is given in a relative form
   */
  static mock(json: DirectoryJSON, cwd?: string): void {
    vol.fromJSON(json, cwd);
  }

  /**
   * Exports the whole contents of the volume recursively to a flat JSON object
   * @param paths is an optional argument that specifies one or more paths to be exported. If this argument is omitted, the whole volume is exported. paths can be an array of paths. A path can be a string, Buffer or an URL object.
   * @param json is an optional object parameter which will be populated with the exported files
   * @param isRelative is boolean that specifies if returned paths should be relative
   * @returns
   */
  static toJSON(
    paths?: PathLike | PathLike[],
    json?: Record<string, unknown>,
    isRelative?: boolean
  ): DirectoryJSON {
    return vol.toJSON(paths, json, isRelative);
  }

  /**
   * Removes all files from the volume.
   */
  static reset(): void {
    vol.reset();
  }

  // Temporary solution, when all tests will be rewritten to Fixtures mocks can be moved into __mocks__ folder
  static fsExtra(): any {
    return {
      ...memfs,
      pathExists: jest.fn().mockImplementation(pathExists),
      remove: jest.fn().mockImplementation(memfs.promises.rm),
      readFile: jest.fn().mockImplementation(readFile),
      writeFile: jest.fn().mockImplementation(memfs.promises.writeFile),
      outputFile: jest.fn().mockImplementation(outputFile),
    };
  }

  private static getPathToFixtures(fixturesRoot = '.'): string {
    const stack = callsite();
    const callerDir = upath.dirname(stack[2].getFileName());
    return upath.resolve(callerDir, fixturesRoot, '__fixtures__');
  }
}

function readFile(fileName: string, encoding?: string): Promise<unknown> {
  return memfs.promises.readFile(fileName, encoding ?? 'utf8');
}

export async function outputFile(
  file: string,
  data: string | Buffer | Uint8Array
): Promise<void> {
  const dir = upath.dirname(file);

  if (await pathExists(dir)) {
    await memfs.promises.writeFile(file, data);
  } else {
    await memfs.promises.mkdir(dir, {
      recursive: true,
    });
    await memfs.promises.writeFile(file, data);
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await memfs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}
