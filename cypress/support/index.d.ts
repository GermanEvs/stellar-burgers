declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    auth(): Chainable<void>;
    logout(): Chainable<void>;
    debugDOM(selector?: string): Chainable<void>;
    logText(): Chainable<void>;
    findByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    findByText(text: string): Chainable<JQuery<HTMLElement>>;
    waitForLoading(): Chainable<void>;
    clearAuth(): Chainable<void>;
  }
}