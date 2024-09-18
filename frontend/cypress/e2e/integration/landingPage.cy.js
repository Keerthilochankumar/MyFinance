/// <reference types="cypress" />

describe('Landing Page', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should render the page correctly', () => {
      cy.contains('Sign Up').should('be.visible');
      cy.contains('Log In').should('be.visible');
    });
  
    it('should switch languages when clicking on language buttons', () => {
      cy.get('button').contains('Español').click();
      
      cy.contains('Regístrate').should('be.visible');
    });
  
    it('should navigate to signup and signin pages', () => {
      
      cy.contains('Sign Up').click();
      cy.url().should('include', '/signup');

      cy.visit('/');

      cy.contains('Log In').click();
      cy.url().should('include', '/signin');
    });
  
    it('should trigger an error when clicking the "Break the world" button', () => {
      cy.contains('Break the world').click();
  
      cy.on('uncaught:exception', (err) => {
        expect(err.message).to.include('Function not implemented');
        return false; 
      });
    });
  });
  