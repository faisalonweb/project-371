import { useEffect, useState } from "react";

function useGetSectors() {
  const [isLoadingSector, setisLoadingSector] = useState(true);
  const [userSectors, setUserSectors] = useState([]);
  useEffect(() => {
    fetch("/api/sectors")
      .then((res) => res.json())
      .then((json) => {
        setUserSectors(json);
        setisLoadingSector(false);
      })
      .catch(() => setisLoading(false));
  }, []);
  return [userSectors, isLoadingSector];
}

export default useGetSectors;
