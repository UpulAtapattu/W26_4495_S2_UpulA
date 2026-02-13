import { Client, MetaData } from "@/app/components/tables/ClientTable";
import { useEffect, useState } from "react";

export function useClients({
  query,
  page,
  limit,
  sort,
}: {
  query: string;
  page: number;
  limit?: number;
  sort: "newest" | "oldest";
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      params.set("sort", sort);

      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();

      setClients(data.data);
      setMeta(data.meta);
      setLoading(false);
    };

    fetchClients();
  }, [query, page, limit, sort]);

  return { clients, loading, meta };
}
