import { DEFAULT_OPTIONS } from '../constants';
import { RunnerOptions } from '../types/runner';
import { getCodepoints } from '../utils/codepoints';
import { FontGeneratorOptions } from '../types/generator';
import { AssetType, AssetWithTemplateType, ASSET_TYPES } from '../types/misc';
import { AssetsMap } from '../utils/assets';

export const getGeneratorOptions = (
  options: RunnerOptions,
  assets: AssetsMap
): FontGeneratorOptions => ({
  ...options,
  codepoints: getCodepoints(assets, options.codepoints),
  formatOptions: prefillOptions(
    options.formatOptions,
    DEFAULT_OPTIONS.formatOptions
  ),
  templates: {
    ...DEFAULT_OPTIONS.templates,
    ...options.templates
  } as { [key in AssetWithTemplateType]: string },
  assets
});

export const prefillOptions = (
  userOptions: { [key in AssetType]?: object } = {},
  defaults: { [key in AssetType]?: object }
) =>
  Object.values(ASSET_TYPES).reduce(
    (cur = {}, type: AssetType) => ({
      ...cur,
      [type]: { ...(defaults[type] || {}), ...(userOptions[type] || {}) }
    }),
    {}
  ) as { [key in AssetType]: {} };
