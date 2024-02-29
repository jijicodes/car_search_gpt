import React, { useEffect, useState } from "react";

const base_url = "http://localhost:8080/make";
export const useFetchCars = () => {
  const [carsApi, setCarsApi] = useState([]);

  useEffect(() => {
    const fetchCarApi = async () => {
      const fetchData = await fetch(base_url);
      const parsedData = await fetchData.json();
      setCarsApi(parsedData);
    };
    fetchCarApi();
    console.log(carsApi, "result");
  }, []);
};
