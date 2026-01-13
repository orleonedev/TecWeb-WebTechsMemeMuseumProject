describe('Meme Operations Flow', () => {
    const testUser = {
      email: 'user1@example.com',
      password: 'test1234',
      username: 'MemeLord1'
    };
  
    beforeEach(() => {
      // Ensure user is logged in for operations that require authentication
      cy.visit('/auth');
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(1) > .input').type(testUser.email);
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type(testUser.password);
      cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > .btn').click();
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    it('should allow an authenticated user to upload a meme', () => {
      cy.visit('/upload');
  
      const memeTitle = `Cypress Test Meme ${Date.now()}`;
      const memeDescription = 'A funny meme uploaded via Cypress.';
      const tags = ['cypress', 'test', 'funny'];
      const imageFile = 'meme.svg'; // Make sure this file exists in cypress/fixtures
  
      cy.get('input[placeholder="Enter a catchy title..."]').type(memeTitle);
      cy.get('textarea[placeholder="Describe your meme..."]').type(memeDescription);
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageFile}`);
  
      tags.forEach(tag => {
        cy.get('input[placeholder="e.g., funny, cat, programming"]').type(`${tag}{enter}`);
      });
  
      cy.get('button[type="submit"]').click();
  
      // Should redirect to home page and show the new meme
      cy.url().should('eq', 'http://localhost:5173/');
      cy.contains(memeTitle).should('be.visible');
    });
  
    it('should display memes on the homepage for unauthenticated users', () => {
      cy.get('.navbar-end > .dropdown > label').click();
      cy.contains('Logout').click();
      cy.url().should('eq', 'http://localhost:5173/');
  
      cy.visit('/');
      cy.contains('Museum Gallery').should('be.visible');
      cy.get('.card').should('have.length.at.least', 1); // At least one meme should be visible
    });
  
    it('should navigate to and display a meme\'s detail page', () => {
      // Assuming there's at least one meme on the homepage
      cy.visit('/');
      cy.get('.card a').first().click(); // Click on the first meme card
  
      cy.url().should('include', '/memes/');
      cy.get('h1').should('be.visible'); // Meme title
      cy.contains('Comments').should('be.visible');
    });
  
    it('should display the Meme of the Day', () => {
      cy.visit('/meme-of-the-day');
      cy.get('h1').contains('Meme of the Day').should('be.visible');
      cy.get('.card-title').should('be.visible'); // Ensure a meme is displayed
    });
  });