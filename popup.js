
document.getElementById('reveal').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ['reveal_password.js']
  });
});
