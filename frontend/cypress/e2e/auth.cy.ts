describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.visit('/auth');
    });
  
    it('should allow a user to register and then log in', () => {
      const email = `test-register-${Date.now()}@example.com`;
      const username = `testuser${Date.now()}`;
      const password = 'password123';
  
      // Register
      cy.get('input[name="username"]').type(username);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type(email);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > div:nth-of-type(3) > .input').type(password);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > .btn').click();
  
      // After successful registration, it should automatically log in and redirect to home
      cy.url().should('eq', 'http://localhost:5173/');
      cy.contains('Museum Gallery').should('be.visible');
      cy.window().its('localStorage').invoke('getItem', 'token').should('exist');
  
      // Logout for cleanup
      cy.get('.navbar-end > .dropdown > label').click();
      cy.contains('Logout').click();
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    it('should allow an existing user to log in', () => {
      // Assuming a user already exists from a previous registration or seed
      const email = 'user1@example.com'; // Use a consistent test user
      const password = 'test1234';
        
      // Type into login form
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(1) > .input').type(email);
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type(password);
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > .btn').click();
        
      // Should redirect to home
      cy.url().should('eq', 'http://localhost:5173/');
      cy.contains('Museum Gallery').should('be.visible');
      cy.window().its('localStorage').invoke('getItem', 'token').should('exist');
    });
  
    it('should show an error for invalid login credentials', () => {
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(1) > .input').type('nonexistent@example.com');
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type('wrongpassword');
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > .btn').click();
  
      cy.get('.alert-error').should('be.visible');
      cy.contains('Invalid credentials').should('be.visible');
    });
  });