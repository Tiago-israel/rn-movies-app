import { useEffect, useRef, useState } from "react";
import { ViewMoreService } from "../services";
import { GenericItem, ServiceType } from "../interfaces";

export function useViewMore(type: ServiceType) {
  const page = useRef(1);
  const service = useRef(new ViewMoreService(type));
  const [items, setItems] = useState<GenericItem[]>([]);

  async function getPaginatedItems() {
    const { results = [], totalPages } = await service.current.getPaginatedItems(
      page.current
    );
    setItems((prevItems) => [...prevItems, ...results]);

    if (page.current <= totalPages) {
      page.current += 1;
    }
  }

  useEffect(() => {
    if (type) {
      service.current = new ViewMoreService(type);
      setItems([]);
      getPaginatedItems();
    }

    return () => {
      page.current = 1;
      setItems([]);
    };
  }, [type]);

  return { items, getPaginatedItems };
}
