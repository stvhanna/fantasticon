import { parseConfig } from '../config-parser';
import { checkPath } from '../../utils/fs-async';

const checkPathMock = (checkPath as any) as jest.Mock;

jest.mock('../../utils/fs-async', () => ({ checkPath: jest.fn() }));

jest.mock('path');

jest.mock('../../types/misc', () => ({
  FontAssetType: { svg: 'a', eot: 'b' },
  OtherAssetType: { svg: 'c', eot: 'd' }
}));

const mockConfig = {
  inputDir: '/root',
  outputDir: '/root',
  name: 'foo',
  fontTypes: ['a', 'b'],
  assetTypes: ['c', 'd'],
  formatOptions: { svg: { foo: 'bar' } },
  codepoints: { foo: 'bar' },
  fontHeight: 1,
  descent: 2,
  normalize: true,
  round: 3,
  selector: null,
  tag: 'f',
  prefix: 'baz'
};

const testError = async (options: object, key: string, message: string) =>
  expect(() => parseConfig({ ...mockConfig, ...options })).rejects.toThrow(
    `Invalid option ${key}: ${message}`
  );

const testParsed = async (key: string, input: any, output: any) =>
  expect((await parseConfig({ ...mockConfig, [key]: input }))[key]).toEqual(
    output
  );

describe('Config parser', () => {
  beforeEach(() => {
    checkPathMock.mockClear();
    checkPathMock.mockImplementation(() => Promise.resolve(true));
  });

  test('returns correctly parsed input when valid', async () => {
    expect(await parseConfig({ ...mockConfig })).toEqual({ ...mockConfig });
  });

  test('correctly parses acceptable values', async () => {
    await testParsed('descent', undefined, undefined);
    await testParsed('descent', '1', 1);
    await testParsed('normalize', 'true', true);
    await testParsed('normalize', '1', true);
    await testParsed('normalize', 1, true);
  });

  test('throws expected validation errors when given invalid input', async () => {
    await testError({ inputDir: 2 }, 'inputDir', '2 is not a string');
    await testError(
      { inputDir: {} },
      'inputDir',
      '[object Object] is not a string'
    );
    await testError(
      { inputDir: undefined },
      'inputDir',
      'undefined is not a string'
    );
    await testError({ name: 3 }, 'name', '3 is not a string');
    await testError(
      { fontTypes: ['x'] },
      'fontTypes',
      'x is not valid - accepted values are: a, b'
    );
    await testError(
      { assetTypes: ['x'] },
      'assetTypes',
      'x is not valid - accepted values are: c, d'
    );
    await testError({ descent: 'a' }, 'descent', 'a is not a valid number');
    await testError(
      { normalize: null },
      'normalize',
      'must be a boolean value'
    );
  });

  test('throws expected error when passing an unrecognised option', async () => {
    await expect(() =>
      parseConfig({ ...mockConfig, foo: 'bar' })
    ).rejects.toThrow("The option 'foo' is not recognised");
  });
});