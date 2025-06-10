import type { ElementValue } from '../elements';
import type {
  CreateTokenModel,
  UpdateTokenModel,
  Token,
  EncryptTokenModel,
  EncryptedToken,
} from '../../models';
import { Create, Encrypt, Retrieve, Update } from './shared';

type CreateToken = CreateTokenModel<ElementValue>;
type UpdateToken = UpdateTokenModel<ElementValue>;
type EncryptToken = EncryptTokenModel<ElementValue>;

type Tokens = Create<Token, CreateToken> &
  Retrieve<Token<any>> &
  Update<Token, UpdateToken> &
  Encrypt<EncryptedToken, EncryptToken>;

export type { Tokens, CreateToken, UpdateToken };
