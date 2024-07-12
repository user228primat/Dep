chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.method === "POST" && details.url.includes("GetGame")) {
      // Пример данных для тела запроса
      const requestBody = {
        key1: "value1",
        key2: "value2"
      };

      fetch(details.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...details.requestHeaders
        },
        body: JSON.stringify(requestBody)
      })
      .then(response => response.json())
      .then(responseBody => {
        // Извлекаем только нужные поля, если они существуют
        const filteredResponse = {
          results: responseBody.contest?.rounds?.map(round => round.result) || [],
          latest_contest_order: responseBody.latest_contest_order || null
        };

        // Проверяем, пуст ли массив "results"
        if (filteredResponse.results.length > 0) {
          chrome.storage.local.get({postResponses: []}, function(result) {
            let postResponses = result.postResponses;

            // Удаляем старые ответы с таким же значением "latest_contest_order"
            postResponses = postResponses.filter(item => JSON.parse(item.response).latest_contest_order !== filteredResponse.latest_contest_order);

            // Добавляем новый ответ
            postResponses.push({
              url: details.url,
              response: JSON.stringify(filteredResponse) // Преобразуем объект в строку JSON
            });

            // Сохраняем обновленный массив ответов
            chrome.storage.local.set({postResponses: postResponses});
          });
        }
      })
      .catch(error => console.error('Error fetching response body:', error));
    }
  },
  {urls: ["<all_urls>"]}
);