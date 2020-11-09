import { resolve } from 'path';
import { RunnerOptionalOptions } from './types/runner';
import { FontAssetType, OtherAssetType } from './types/misc';

const defaultTemplatePath = (file: string) =>
  resolve(__dirname, `../templates/${file}.hbs`);

export const DEFAULT_OPTIONS: RunnerOptionalOptions = {
  name: 'icons',
  fontTypes: [FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
  assetTypes: [
    OtherAssetType.CSS,
    OtherAssetType.HTML,
    OtherAssetType.JSON,
    OtherAssetType.TS
  ],
  formatOptions: { json: { indent: 4 } },
  pathOptions: {},
  codepoints: {},
  round: undefined,
  fontHeight: 300,
  descent: undefined,
  normalize: undefined,
  selector: null,
  tag: 'i',
  prefix: 'icon',
  fontsUrl: undefined,
  templates: {
    css: defaultTemplatePath('css'),
    scss: defaultTemplatePath('scss'),
    sass: defaultTemplatePath('sass'),
    html: defaultTemplatePath('html')
  }
};

export const DEFAULT_START_CODEPOINT = 0xf101;
