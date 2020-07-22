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

      cy.get('.notification.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
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

      cy.get('.blogDefaultView')
        .should('contain', 'my cool blog Crystal Wang')
    })

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'To Be Deleted Blog',
          author: 'J.K Rolling',
          url: 'youtube.com',
          likes: 2
        })
        cy.createBlog({
          title: 'Likeable Blog',
          author: 'Jiyoung Yun',
          url: 'naver.com',
          likes: 6
        })
        cy.createBlog({
          title: 'Filler Blog 2',
          author: 'Joshua Shen',
          url: 'Boobies.com',
          likes: 4
        })
      })
      it(' blogs are ordered according to likes with the blog with the most likes being first', function() {
        const blogsList = ['Likeable Blog Jiyoung Yun', 'Filler Blog 2 Joshua Shen', 'To Be Deleted Blog J.K Rolling']
        cy.get('.blogInfo')
          .then((blogs) => {
            const blogsText = blogs.toArray().map(blog => blog.innerText)
            expect(blogsText).to.deep.eq(blogsList)
          })
      })

      it('one of those can be liked', function() {
        cy.contains('Likeable Blog')
          .parent()
          .contains('view')
          .click()

        cy.get('.blogDetailsView')
          .contains('Likeable Blog')
          .parent()
          .contains('like')
          .click()
          .parent()
          .contains('likes 7')
      })

      it('one of those can be deleted', function() {
        cy.contains('To Be Deleted Blog')
          .parent()
          .contains('view')
          .click()

        cy.get('.blogDetailsView')
          .contains('To Be Deleted Blog')
          .parent()
          .contains('remove')
          .click()

        cy.get('html')
          .should('not.contain', 'To Be Deleted Blog')
      })

      describe('when a new user is created and logged in', function() {
        beforeEach(function () {
          const anotherUser = {
            name: 'Deadmau5',
            username: 'deadmouth5',
            password: 'raiseyourweapon'
          }
          cy.request('POST', 'http://localhost:3003/api/users', anotherUser)

          cy.login({ username: 'deadmouth5', password: 'raiseyourweapon' })
        })

        it('other users cannot delete blog created by another user', function() {
          cy.contains('To Be Deleted Blog')
            .parent()
            .contains('view')
            .click()

          cy.get('.blogDetailsView')
            .contains('To Be Deleted Blog')
            .parent()
            .get('#remove')
            .should('have.css', 'display', 'none')
        })
      })
    })
  })
})