import { useState, useEffect, useCallback } from 'react';

export default function useFetch(url, options) {
  const [data, setData] = useState(null); //from sever
  const [loading, setLoading] = useState(false); //состояние
  const [error, setError] = useState(null);

  //используем useCallback, а не useState, потому как мы непересоздаем функцию, так мы обеспечиваем стабильность ссылок на функции
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null); // убираем предыдущие ошибки для повторного использования 

    fetch(url, options)
      .then(res => {
        if (!res.ok) throw new Error('Network response is falsy.Try again or refresh connection');
        return res.json(); //ответ в json
      })
      .then(json => setData(json))
      .catch(err => setError(err))
      .finally(() => setLoading(false)); // загрузка - true, перестало грузить - false. 
  }, [url, options]);

    // Запускаем загрузку данных при монтировании компонента или изменении URL
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
  //refetch — это функция, которая позволяет повторно запустить запрос
  // когда тебе это нужно вручную.

}