// This content script finds all password fields and changes their type to text, with error handling
(function revealPasswords() {
  try {
    const inputs = document.querySelectorAll('input[type="password"]');
    if (inputs.length === 0) {
      console.warn('No password fields found on this page.');
      alert('No password fields found on this page.');
      return;
    }
    inputs.forEach(input => {
      try {
        input.type = 'text';
      } catch (err) {
        console.error('Failed to reveal password for an input:', err);
      }
    });
  } catch (error) {
    console.error('Error revealing passwords:', error);
    alert('An error occurred while revealing passwords.');
  }
})();
