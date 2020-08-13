describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    //create a user to backend
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    const anotherUser = {
      name: 'Deadmau5',
      username: 'deadmouth5',
      password: 'raiseyourweapon'
    }
    cy.request('POST', 'http://localhost:3003/api/users', anotherUser)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown by default', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#Title').type('my cool blog')
      cy.get('#Author').type('Crystal Wang')
      cy.get('#Url').type('wordpress.com')
      cy.get('#submitBlog').click()

      cy.contains('my cool blog Crystal Wang')
    })

    describe('When several blogs created by many people exist', function() {
      beforeEach(function() {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({ author: 'John Doe', title: 'test1', url: 'http://example.com./test1' })
        cy.createBlog({ author: 'John Doe', title: 'test2', url: 'http://example.com./test2' })
        cy.contains('logout').click()
        cy.login({ username: 'deadmouth5', password: 'raiseyourweapon' })
        cy.createBlog({ author: 'Jane Doe', title: 'test3', url: 'http://example.com./test3' })

        cy.contains('test1').parent().parent().as('blog1')
        cy.contains('test2').parent().parent().as('blog2')
        cy.contains('test3').parent().parent().as('blog3')

      })

      it('Blogs can be liked', function() {
        cy.get('@blog2').contains('view').click()
        cy.get('@blog2').contains('like').click()
        cy.get('@blog2').contains('likes 1')
      })

      it('they are ordered by number of likes', function() {
        cy.get('@blog1').contains('view').click()
        cy.get('@blog2').contains('view').click()
        cy.get('@blog3').contains('view').click()
        cy.get('@blog1').contains('like').as('like1')
        cy.get('@blog2').contains('like').as('like2')
        cy.get('@blog3').contains('like').as('like3')

        cy.get('@like2').click()
        cy.get('@like1').click()
        cy.get('@like1').click()
        cy.get('@like3').click()
        cy.get('@like3').click()
        cy.get('@like3').click()

        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('likes 3')
          cy.wrap(blogs[1]).contains('likes 2')
          cy.wrap(blogs[2]).contains('likes 1')
        })
      })

      it('the creator can delete a blog', function() {
        cy.get('@blog3').contains('view').click()
        cy.get('@blog3').contains('remove').click()
        cy.get('html').should('not.contain', 'test3')
      })

      it('other uses cannot delete blog created by another user', function() {
        cy.get('@blog2').contains('view').click()
        cy.get('@blog2').contains('remove').should('not.be.visible')
      })
    })
  })
})