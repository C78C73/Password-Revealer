// This content script finds all password fields and changes their type to text, with error handling and debugging
(function revealPasswords() {
  let attempts = 0;
  const maxAttempts = 10;
  const interval = 500; // ms

  // Helper: deep search for password fields in shadow DOM
  function findPasswordInputsDeep(root=document) {
    let results = [];
    // Standard password inputs
    results = Array.from(root.querySelectorAll('input[type="password"]'));
    // Heuristic: look for inputs with password-like attributes
    if (results.length === 0) {
      results = Array.from(root.querySelectorAll('input')).filter(input => {
        const attrs = [input.name, input.id, input.getAttribute('aria-label'), input.getAttribute('placeholder')];
        return attrs.some(a => a && a.toLowerCase().includes('password'));
      });
    }
    // Deep shadow DOM search
    const allElements = Array.from(root.querySelectorAll('*'));
    allElements.forEach(el => {
      if (el.shadowRoot) {
        results = results.concat(findPasswordInputsDeep(el.shadowRoot));
      }
    });
    return results;
  }

  // Helper: search for password fields in all iframes
  function findPasswordInputsInFrames() {
    let results = [];
    const iframes = Array.from(document.querySelectorAll('iframe'));
    iframes.forEach(iframe => {
      try {
        if (iframe.contentDocument) {
          results = results.concat(findPasswordInputsDeep(iframe.contentDocument));
        }
      } catch (e) {
        console.warn('[Password Revealer] Could not access iframe due to cross-origin:', iframe);
      }
    });
    return results;
  }

  function revealAndStop(inputs) {
    inputs.forEach((input, idx) => {
      try {
        input.type = 'text';
        if (input.type !== 'text') {
          // Could not reveal
        }
      } catch (err) {
        // Ignore errors
      }
    });
  }

  function tryReveal() {
    attempts++;
    try {
      let inputs = findPasswordInputsDeep(document);
      inputs = inputs.concat(findPasswordInputsInFrames());
      if (inputs.length === 0) {
        if (attempts < maxAttempts) {
          setTimeout(tryReveal, interval);
        } else {
          // No password fields found after max attempts
        }
        return;
      }
      revealAndStop(inputs);
      // Stop retrying once a password field is found and revealed
      observer.disconnect();
      return;
    } catch (error) {
      // Ignore errors
    }
  }

  // MutationObserver to catch dynamically added password fields
  const observer = new MutationObserver(() => {
    let inputs = findPasswordInputsDeep(document);
    inputs = inputs.concat(findPasswordInputsInFrames());
    if (inputs.length > 0) {
      revealAndStop(inputs);
      observer.disconnect();
    }
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  tryReveal();
})();
