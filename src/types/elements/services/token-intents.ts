import type { ElementValue } from '~/types/elements';
import type {
  CreateTokenIntent as CreateTokenIntentModel,
  TokenIntent,
} from '~/types/models';
import { Create } from './shared';

type CreateTokenIntent = CreateTokenIntentModel<ElementValue>;

type TokenIntents = Create<TokenIntent, CreateTokenIntent>;

export type { TokenIntents, CreateTokenIntent };
