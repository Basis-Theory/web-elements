import type { ElementValue } from '../../elements';
import type {
  CreateToken as CreateTokenModel,
  UpdateToken as UpdateTokenModel,
  Token,
} from '../../models';
import { Create, Retrieve, Update } from './shared';

type CreateToken = CreateTokenModel<ElementValue>;
type UpdateToken = UpdateTokenModel<ElementValue>;

type Tokens = Create<Token, CreateToken> &
  Retrieve<Token<unknown>> &
  Update<Token, UpdateToken>;

export type { Tokens, CreateToken, UpdateToken };
