import debounce from "lodash/debounce";
import { useCallback, useState } from "react";

export const useDebouncedSearch = () => {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => setSearch(query), 500),
    []
  );

  return { debouncedSearch, search };
};
