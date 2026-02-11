export type GetClientsParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export async function getClients(params: GetClientsParams = {}) {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`/api/clients?${query.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch clients");
  }

  return res.json();
}
