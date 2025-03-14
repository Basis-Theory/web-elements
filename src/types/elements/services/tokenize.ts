import type { ElementValue } from '../';
import type { TokenizeData as TokenizeDataModel } from '../../models';
import { RequestOptions } from './shared';

type TokenizeData = TokenizeDataModel<ElementValue>;

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeDataModel>;
}

export type { Tokenize, TokenizeData };
