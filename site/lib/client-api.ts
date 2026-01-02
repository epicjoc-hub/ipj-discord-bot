export type AnuntEveniment = {
  id: string;
  titlu: string;
  data: string;
  ora?: string;
  locatie?: string;
  descriere?: string;
  status?: string;
  categorie?: string;
  prioritate?: string;
  "conținut"?: string;
  continut?: string;
  imagine?: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Eroare la încărcarea datelor');
  }
  return response.json();
}

export const apiClient = {
  getAnunturiEvenimente: () => fetchJson<AnuntEveniment[]>('/api/anunturi-evenimente'),
  getAnunturiPolitie: () => fetchJson<AnuntEveniment[]>('/api/anunturi-politie'),
};
