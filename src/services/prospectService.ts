import type { Prospect } from '../types';
import { mockProspects } from '../data/mockData';

export async function fetchProspects(): Promise<Prospect[]> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return Promise.resolve(mockProspects);
  }
  return Promise.resolve([]);
}

export async function updateProspect(_updated: Prospect): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') return;
}
