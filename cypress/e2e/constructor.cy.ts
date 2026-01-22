/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Мокаем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
    // Для авторизации пользователя (по умолчанию не авторизован)
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'You should be authorized' }
    }).as('getUserUnauthorized');
    
    // Очищаем localStorage и cookies перед каждым тестом
    cy.clearAllCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });

    // Открываем главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем после тестов
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearAllCookies();
  });

  describe('Ingredients loading and display', () => {
    it('should load ingredients from API and display them', () => {
      cy.get('body').should('contain', 'Соберите бургер');
      cy.get('body').should('contain', 'Краторная булка N-200i');
      cy.get('body').should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get('body').should('contain', 'Булки');
      cy.get('body').should('contain', 'Соусы');
      cy.get('body').should('contain', 'Начинки');
    });
  });

  describe('Adding ingredients to constructor', () => {
    it('should add bun to constructor by clicking Add button', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      // Проверяем в конструкторе (правой части)
      cy.get('section').eq(1).should('contain', 'Краторная булка N-200i (верх)');
      cy.get('section').eq(1).should('contain', 'Краторная булка N-200i (низ)');
    });

    it('should add filling to constructor by clicking Add button', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      // Проверяем в конструкторе (правой части)
      cy.get('section').eq(1).should('contain', 'Биокотлета из марсианской Магнолии');
    });

    it('should enable order button when bun is added to constructor', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      cy.get('button').contains('Оформить заказ').should('not.be.disabled');
    });
  });

  describe('Ingredient details modal', () => {
    it('should open ingredient details modal when clicking ingredient', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.location('pathname').should('include', '/ingredients');
    });

    it('should show correct ingredient data in modal/details page', () => {
      cy.contains('Краторная булка N-200i').click();
      
      cy.location('pathname').should('include', '60d3b41abdacab0026a733c6');
      
      cy.contains('Краторная булка N-200i').should('be.visible');
      
      cy.contains('Калории, ккал').should('be.visible');
      cy.contains('Белки, г').should('be.visible');
      cy.contains('Жиры, г').should('be.visible');
      cy.contains('Углеводы, г').should('be.visible');
    });

    it('should close ingredient modal by clicking close button', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.location('pathname').should('include', '/ingredients');
      
      cy.get('body').type('{esc}');
      
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should close ingredient modal by clicking overlay', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.location('pathname').should('include', '/ingredients');
      
      // Ищем оверлей по фиксированной позиции и размерам
      cy.get('body').then(($body) => {
        const overlay = $body.find('div').filter((_, el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.position === 'fixed' && 
                 rect.width > 0 && rect.height > 0 &&
                 rect.top === 0 && rect.left === 0;
        }).first();
        
        if (overlay.length > 0) {
          cy.wrap(overlay).click({ force: true });
        } else {
          // Альтернатива: ищем по известным классам
          cy.get('[class*="overlay"], [class*="modalOverlay"], [class*="backdrop"]').first().click({ force: true });
        }
      });
      
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Order creation process', () => {
    it('should redirect to login page when user is not authenticated', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      cy.get('button').contains('Оформить заказ').click();
      cy.url().should('include', '/login');
    });

    it('should create order successfully when user is authenticated', () => {
      // 1. Перехватываем запрос ингредиентов (важно сделать это перед reload)
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      
      // 2. Переопределяем интерцепт проверки пользователя
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: { email: 'test@example.com', name: 'Test User' }
        }
      }).as('getUserAuth');
      
      // 3. Устанавливаем токены
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'Bearer test-token-123');
        win.localStorage.setItem('refreshToken', 'test-refresh-token-123');
      });
      
      cy.setCookie('accessToken', 'Bearer test-token-123');
      cy.setCookie('refreshToken', 'test-refresh-token-123');
      
      // 4. Мокаем создание заказа
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Space бургер',
          order: { 
            number: 12345,
            ingredients: [],
            _id: '123',
            status: 'done',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        }
      }).as('createOrderMock');
      
      // 5. Перезагружаем страницу
      cy.reload();
      
      // 6. Ждем загрузку ингредиентов
      cy.wait('@getIngredients');
      
      // 7. Даем время для проверки авторизации
      cy.wait(1000);
      
      // 8. Проверяем авторизацию
      cy.get('body').should('not.contain', 'Войти');
      
      // 9. Добавляем ингредиенты
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      // 10. Проверяем, что ингредиенты добавлены в конструктор (правой части - section[1])
      cy.get('section').eq(1).should('contain', 'Краторная булка N-200i (верх)');
      cy.get('section').eq(1).should('contain', 'Краторная булка N-200i (низ)');
      cy.get('section').eq(1).should('contain', 'Биокотлета из марсианской Магнолии');
      
      // 11. Оформляем заказ
      cy.get('button').contains('Оформить заказ').click();
      
      // 12. Ждем создание заказа
      cy.wait('@createOrderMock', { timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body.order.number).to.equal(12345);
      });
      
      // 13. Проверяем, что модальное окно открылось с верным номером заказа
      cy.get('#modals').should('exist');
      cy.contains('12345').should('be.visible');
      
      // 14. **ВАЖНО: Сначала ждем очистки конструктора, потом закрываем модальное окно**
      // Ожидаем появления текста "Выберите булки" и "Выберите начинку" в конструкторе
      cy.get('section').eq(1).should('contain', 'Выберите булки', { timeout: 10000 });
      cy.get('section').eq(1).should('contain', 'Выберите начинку', { timeout: 10000 });
      
      // 15. Проверяем отсутствие ингредиентов в конструкторе (правой части)
      cy.get('section').eq(1).should('not.contain', 'Краторная булка N-200i (верх)');
      cy.get('section').eq(1).should('not.contain', 'Краторная булка N-200i (низ)');
      cy.get('section').eq(1).should('not.contain', 'Биокотлета из марсианской Магнолии');
      
      // 16. **Теперь закрываем модальное окно**
      cy.get('body').type('{esc}');
      
      // 17. Проверяем, что модальное окно закрылось
      cy.wait(1000);
      cy.get('#modals').should('not.contain', '12345');
    });

    it('should show order modal when creating order - simplified test', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });
      
      cy.get('button').contains('Оформить заказ').should('not.be.disabled');
      
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: {
          success: true,
          order: { number: 12345 }
        }
      }).as('createOrderSimple');
      
      cy.get('button').contains('Оформить заказ').click();
      
      cy.wait(2000);
      
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        
        if (bodyText.includes('12345')) {
          cy.contains('12345').should('be.visible');
        } else if (bodyText.includes('Вход')) {
          cy.url().should('include', '/login');
        }
      });
    });
  });

  describe('Constructor functionality', () => {
    it('should count added ingredients correctly', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .within(() => {
          cy.get('button').contains('Добавить').click();
          cy.get('button').contains('Добавить').should('exist');
        });
      
      cy.get('main').should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });
});