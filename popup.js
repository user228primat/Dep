document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get({postResponses: []}, function(result) {
    let responses = result.postResponses;
    let responsesList = document.getElementById('responses');
    responses.forEach(function(response) {
      let listItem = document.createElement('li');
      listItem.textContent = `URL: ${response.url}, Response: ${response.response}`;
      responsesList.appendChild(listItem);
    });
  });
});