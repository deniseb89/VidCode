// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID' 		: process.env.FACEBOOK_APP_ID,
        'clientSecret' 	: process.env.FACEBOOK_APP_SECRET,
        'callbackURL' 	: process.env.FACEBOOK_CB
    },

    'instagramAuth' : {
        'clientID' 		: process.env.INSTAGRAM_CLIENT_ID,
        'clientSecret' 	: process.env.INSTAGRAM_CLIENT_SECRET,
        'callbackURL' 	: process.env.INSTAGRAM_CB
    },

    'twitterAuth' : {
        'consumerKey' 		: 'your-secret-clientID-here',
        'consumerSecret' 	: 'your-client-secret-here',
        'callbackURL' 	: 'add'
    },

    'googleAuth' : {
        'clientID' 		: 'your-secret-clientID-here',
        'clientSecret' 	: 'your-client-secret-here',
        'callbackURL' 	: 'add'
    }

};