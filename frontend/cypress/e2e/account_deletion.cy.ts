describe('Account Deletion Flow', () => {
    const testUser = {
      email: `test-delete-${Date.now()}@example.com`,
      password: 'password123',
      username: `deleteuser${Date.now()}`
    };
  
    beforeEach(() => {
      // Register a new user for deletion testing
      cy.visit('/auth');
      cy.get('input[name="username"]').type(testUser.username);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type(testUser.email);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > div:nth-of-type(3) > .input').type(testUser.password);
      cy.get('div:nth-of-type(1) > .card-body > .space-y-4 > .btn').click();
      cy.url().should('eq', 'http://localhost:5173/');
      cy.window().its('localStorage').invoke('getItem', 'token').should('exist');
      cy.visit('/account'); // Navigate to account page
    });
  
    it('should allow a user to delete their account', () => {
      // Confirm the deletion prompt
      cy.on('window:confirm', (text) => {
        expect(text).to.contain('Are you sure you want to delete your account? This action cannot be undone.');
        return true; // Simulate clicking 'OK'
      });
  
      // Click the delete account button
      cy.get('.card-actions > .btn-error').click();
  
      // Should show an alert for success
      cy.on('window:alert', (text) => {
        expect(text).to.contain('Your account has been successfully deleted.');
      });
  
      // Should redirect to homepage and be logged out
      cy.url().should('eq', 'http://localhost:5173/');
      cy.window().its('localStorage').invoke('getItem', 'token').should('not.exist');
      
      // Open dropdown to see Login link
      cy.get('.navbar-end > .dropdown > label').click();
      cy.contains('Login / Register').should('be.visible');
    });
  });