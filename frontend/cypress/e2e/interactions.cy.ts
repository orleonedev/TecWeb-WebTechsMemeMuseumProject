describe('Meme Interactions and Filtering', () => {
  const testUser = {
    email: 'user1@example.com',
    password: 'test1234',
    username: 'MemeLord1'
  };

  beforeEach(() => {
    // Log in before each test that requires authentication
    cy.visit('/auth');
    cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(1) > .input').type(testUser.email);
    cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > div:nth-of-type(2) > .input').type(testUser.password);
    cy.get('div:nth-of-type(2) > .card-body > .space-y-4 > .btn').click();
    cy.url().should('eq', 'http://localhost:5173/');
    
    // We assume the DB is seeded with 'funny' memes.
    // If not, 'meme_operations' test usually runs before this and creates memes.
  });

  it('should allow an authenticated user to vote on a meme', () => {
    cy.get('.card').first().find('a').click(); // Go to first meme detail page
    cy.url().should('include', '/memes/');

    // Get initial score
    // Selector for score is the span between buttons in the vote column
    cy.get('div.flex.flex-col.items-center.gap-1 > span').then(($score) => {
      const initialScore = parseInt($score.text(), 10);

      // Upvote (name = "upvote-button")
      cy.get('button[name="upvote-button"]').click();
      
      // Check for optimistic update or eventual consistency
      cy.get('div.flex.flex-col.items-center.gap-1 > span').should(($scoreAfterUpvote) => {
        const scoreAfterUpvote = parseInt($scoreAfterUpvote.text(), 10);
        // It might be same if we un-toggled, or +1. 
        // Just checking it exists and is a number is mostly enough for E2E without resetting state perfectly.
        expect(scoreAfterUpvote).not.to.be.NaN;
        expect(scoreAfterUpvote).not.to.equal(initialScore);
      });
    });
  });

  it('should allow an authenticated user to add a comment to a meme', () => {
    cy.get('.card').first().find('a').click(); // Go to first meme detail page
    cy.url().should('include', '/memes/');

    const commentText = `Cypress comment ${Date.now()}`;
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.get('button[type="submit"]').contains('Post Comment').click();

    cy.contains(commentText).should('be.visible');
  });

  it('should allow filtering memes by tag using the new UI', () => {
    cy.visit('/');
    const tagToSearch = 'funny'; 
    
    // Type tag and press enter
    cy.get('input[placeholder="Filter by tags... (Enter)"]').type(`${tagToSearch}{enter}`);
    
    // Verify badge appeared
    cy.contains('.badge', tagToSearch).should('be.visible');
    
    // Click "Apply Filters"
    cy.contains('button', 'Apply Filters').click();

    // Verify URL
    cy.url().should('include', `tag=${tagToSearch}`);
  });

  it('should allow sorting memes by popularity using the new UI', () => {
    cy.visit('/');
    
    // Select "Most Popular"
    cy.get('select').select('popularity');
    
    // Click "Apply Filters"
    cy.contains('button', 'Apply Filters').click();

    // Verify URL
    cy.url().should('include', 'sortBy=popularity');
  });
});
