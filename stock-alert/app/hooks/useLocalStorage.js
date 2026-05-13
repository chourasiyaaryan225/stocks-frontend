// hooks/useLocalStorage.js

"use client";

import { useEffect, useState } from "react";

const useLocalStorage = () => {

  const [storageData, setStorageData] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setStorageData({
      token,
      user: user ? JSON.parse(user) : null,
    });
  }, []);
  return storageData;
};

export default useLocalStorage;