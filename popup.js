document.getElementById('reveal').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      document.querySelectorAll('input[type="password"]').forEach((input) => {
        input.type = 'text';
      });
    }
  });
});
