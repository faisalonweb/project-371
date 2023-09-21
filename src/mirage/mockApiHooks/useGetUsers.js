import { useEffect, useState } from "react";

function useGetUsers() {
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setisLoading(false);
      })
      .catch(() => setisLoading(false));
  }, []);

  return [data, isLoading];
}

export default useGetUsers;
