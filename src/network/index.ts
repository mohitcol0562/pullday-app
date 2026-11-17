import { ApiClient } from './ApiClient';
import { MockApiClient } from './MockApiClient';

// Swapped for HttpApiClient in M10 once the real backend exists.
export const apiClient: ApiClient = new MockApiClient();

export * from './types';
