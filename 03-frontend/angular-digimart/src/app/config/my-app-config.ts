export default {

    oidc : {
        clientId: '0oahz5wn73gErIiJM5d7', //Public identifier for the client that is required for all OAuth flows.
        issuer: 'https://dev-68052349.okta.com/oauth2/default', // refers to the domain provided by okta to my account. This url will be used during authorizing with okta authorization server
        redirectUri: 'https://localhost:4200/login/callback', //Okta sends the authentication response and ID token for the user's sign-in request to these URIs, basically once the usr logs in, he gets redirected to this url by okta
        scopes : ['openid', 'profile', 'email']  //provides access to information about th user.openid scope provides authentication related info of the user, profile scope provides info regarding first name, last name, phone no. etc of the user.
    }
}
