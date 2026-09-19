import { apiJson } from '@/api/client';
import type { TApplicationConfiguration } from '@/types/application-configuration';

export async function getApplicationConfiguration() {
  return apiJson<TApplicationConfiguration>('/api/application-configuration');
}

export async function updateApplicationConfiguration(configuration: Partial<TApplicationConfiguration>) {
  return apiJson<TApplicationConfiguration>('/api/application-configuration', {
    method: 'PATCH',
    body: configuration,
  });
}
