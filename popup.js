

const revealBtn = document.getElementById('reveal');
if (revealBtn) {
  revealBtn.addEventListener('click', async () => {
    revealBtn.disabled = true;
    const originalText = revealBtn.textContent;
    revealBtn.textContent = 'Revealing...';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) throw new Error('No active tab found');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['reveal_password.js']
      });
      revealBtn.textContent = 'Revealed!';
      setTimeout(() => {
        revealBtn.textContent = originalText;
        revealBtn.disabled = false;
      }, 2000);
    } catch (e) {
      revealBtn.textContent = 'Error';
      setTimeout(() => {
        revealBtn.textContent = originalText;
        revealBtn.disabled = false;
      }, 2000);
    }
  });
}
