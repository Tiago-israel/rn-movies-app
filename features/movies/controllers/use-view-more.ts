import { useEffect, useRef, useState, useTransition } from "react";
import { ViewMoreService } from "../services";
import { GenericItem, ServiceType } from "../interfaces";

export function useViewMore(type: ServiceType) {
  const page = useRef(1);
  const service = useRef(new ViewMoreService(type));
  const [items, setItems] = useState<GenericItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getPaginatedItems() {
    if (page.current === 1) {
      setIsLoading(true);
    }
    try {
      const { results = [], totalPages } =
        await service.current.getPaginatedItems(page.current);
      setItems((prevItems) => [...prevItems, ...results]);

      if (page.current <= totalPages) {
        page.current += 1;
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (type) {
      service.current = new ViewMoreService(type);
      page.current = 1;
      setItems([]);
      setIsLoading(true);
      getPaginatedItems();
    }

    return () => {
      page.current = 1;
      setItems([]);
    };
  }, [type]);

  return { items, getPaginatedItems, isLoading };
}
