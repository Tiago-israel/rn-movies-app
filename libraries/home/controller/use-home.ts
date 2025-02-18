import { useEffect, useState } from "react";
const token =
  "BQAlBo8drq5mIfO9OTz2jl4Se9q-JAB10G-H6dTvRO_zRSMTK1T0ZjckWqPax10zevjF8D2QCWX3hYRqgeQHHn43O2qBtCMtUzIOmHwadqKezQahGKziX2vRu5i6wVcSGx5GcupUerYWjUuQit9ZiYpxFoMVjCfedGiGuMVSr6cGHQ9x0J9QMkOND6SjgpOZvrWBHRL6dniuxWQty_zOKq4y4GBLpMYme2cZNwjrHyJlvuu7OxIbhos3KRFu78tZq1wj1SPHJTQIwXI4_oCjtO-rLLsOA-CpV0KzsdRKY3uhx1S5CM_M1WU9qd3uN6YaE8qbNY5E";

export async function getArtists(callback: (artists: any) => void) {
  const res = await fetch(
    // "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/top-tracks?market=pt-BR",
    "https://api.spotify.com/v1/tracks/60a0Rd6pjrkxjPbaKzXjfq",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );

  const data = await res.json();
  callback(data.tracks);
}

export function useHome() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getArtists(setArtists);
  }, []);

  return { artists };
}
