import './commands';

Cypress.on('uncaught:exception', (err) => {
  // Игнорируем ошибки, связанные с ResizeObserver
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});