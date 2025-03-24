import type { ElementValue } from '../../elements';
import type { CreateTokenIntentModel, TokenIntent } from '../../models';
import { Create } from './shared';

type CreateTokenIntent = CreateTokenIntentModel<ElementValue>;

type TokenIntents = Create<TokenIntent, CreateTokenIntent>;

export type { TokenIntents, CreateTokenIntent };
