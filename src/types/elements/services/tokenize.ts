import type { ElementValue } from '~/types/elements';
import type { TokenizeData as TokenizeDataModel } from '~/types/models';
import { RequestOptions } from './shared';

type TokenizeData = TokenizeDataModel<ElementValue>;

interface Tokenize {
  tokenize(
    tokens: TokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeDataModel>;
}

export type { Tokenize, TokenizeData };
