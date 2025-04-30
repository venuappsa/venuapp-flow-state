
describe('Admin User Management Tests', () => {
  beforeEach(() => {
    // Simulate logged in state as admin
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          user: {
            id: 'admin-user-id',
            email: 'admin@example.com',
            user_metadata: {
              role: 'admin'
            }
          }
        }
      }));
    });
    
    // Visit the admin users page
    cy.visit('/admin/users');
  });

  it('should display user list page', () => {
    // Check page title
    cy.contains('User Management').should('exist');
    
    // Verify table headers
    cy.contains('User').should('exist');
    cy.contains('Role').should('exist');
    cy.contains('Status').should('exist');
    cy.contains('Last Active').should('exist');
    cy.contains('Actions').should('exist');
    
    // Verify at least one user is displayed
    cy.get('tbody tr').should('have.length.at.least', 1);
  });
  
  it('should filter users by role', () => {
    // Open role filter
    cy.contains('All Roles').click();
    
    // Select Admin role
    cy.contains('Admin').click();
    
    // Check that filtered users have Admin role badge
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(1).should('contain', 'admin');
    });
  });
  
  it('should filter users by status', () => {
    // Open status filter
    cy.contains('All Statuses').click();
    
    // Select Active status
    cy.contains('Active').click();
    
    // Check that filtered users have Active status badge
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(2).should('contain', 'active');
    });
  });
  
  it('should search users by name or email', () => {
    // Type in the search input
    cy.get('input[placeholder*="Search users"]').type('admin');
    
    // Check that search results contain the term
    cy.get('tbody tr').each(($row) => {
      const text = $row.text().toLowerCase();
      expect(text.includes('admin')).to.be.true;
    });
  });
  
  it('should open user details dialog', () => {
    // Click on the first user's details button
    cy.get('tbody tr').first().find('button').contains('Details').click();
    
    // Verify user details dialog is open
    cy.contains('User Details').should('be.visible');
    cy.contains('User Info').should('be.visible');
    cy.contains('User Controls').should('be.visible');
  });
  
  it('should change user role in details dialog', () => {
    // Click on the first user's details button
    cy.get('tbody tr').first().find('button').contains('Details').click();
    
    // Go to User Controls tab
    cy.contains('User Controls').click();
    
    // Change role to merchant
    cy.contains('button', 'merchant').click();
    
    // Verify success message
    cy.contains('Role updated').should('exist');
  });
  
  it('should change user status in details dialog', () => {
    // Click on the first user's details button
    cy.get('tbody tr').first().find('button').contains('Details').click();
    
    // Go to User Controls tab
    cy.contains('User Controls').click();
    
    // Deactivate user
    cy.contains('button', 'Deactivate').click();
    
    // Verify success message
    cy.contains('Status updated').should('exist');
  });
});
