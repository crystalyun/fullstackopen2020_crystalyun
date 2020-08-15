/*

1. consider adding comments to blog require auth token.

2. considering introducing form input custom hook for comments form and
new blog form.&& and also id/password

3. question : for signInUserReducer, is `storage` abstraction needed? i already have `signedInUser` redux store state.

    answer : yes you must. because when you refresh the page, localhost:3000, redux state `signedInUser` becomes null again..!!!!. so you need a local storage plus redux state.
    so that upon page refresh, we pull a saved loggedinUser data in local storage and update redux `signedInUser` state accordingly, so that user does not need to login again after page refresh. (based on the assumption that frontend page is derived from the `signedInUser` redux state. on the assumption that when `signedInUser` redux state is null, frontend renders login page. when `signedInUser` redux state is not null and have user loggedIn data, frontend renders blogs list page.)
*/