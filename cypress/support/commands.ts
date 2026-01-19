Cypress.Commands.add('login', (email, password) => {
  cy.intercept('POST', '**/api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      user: { email, name: 'Test User' },
      accessToken: 'Bearer test-token-123',
      refreshToken: 'test-refresh-token-123'
    }
  }).as('loginRequest');
  
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
});

Cypress.Commands.add('auth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', 'Bearer test-token-123');
    win.localStorage.setItem('refreshToken', 'test-refresh-token-123');
  });
  
  cy.setCookie('accessToken', 'Bearer test-token-123');
  cy.setCookie('refreshToken', 'test-refresh-token-123');
});

Cypress.Commands.add('debugDOM', (selector = 'body') => {
  cy.get(selector).then(($el) => {
    console.log(`DOM for ${selector}:`, $el.html());
  });
});