import { useEffect, useState } from 'react';

import { VITE_BASE_URL } from '@/constants';
import { useParams } from 'react-router-dom';
const useGetDocList = () => {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   fetch(`${VITE_BASE_URL}/api/scripts/list_recent`).then(async (response) => {
  //     const json = await response.json();
  //     setData(json.data);
  //   });
  // }, []);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDocList = async () => {
      try {
        const response = await fetch(
          `${VITE_BASE_URL}/api/scripts/list_recent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        setData(json.data);
      } catch (error) {
        console.error('Error fetching document list:', error.message);
      }
    };

    fetchDocList();
  }, [userId, data]);

  return data;
};

export default useGetDocList;
