var Twitter = require('twitter');
var http = require('http');

	// You get 2400 tweets a day, so I'm going to evenly space those
	// throughout a 24-hour period. The bot should post every ~ 36 seconds.
	var cooldown = 36000;
	var cooldownEnd = new Date().getTime() + cooldown;
	var since_id = 0;
	var bot_saying = ["Beep beep! It's she, not he.", 
		"Booooop! It's she, not he.", 
		"Beepbopbeep! It's she, not he.", 
		"~ROBOT CLANKING NOISE~ It's she, not he.",
		"Click, whirrrrrr. It's she, not he.",
		"*Alarm sounds* It's she, not he.",
		"Breeepbeep! It's she, not he."
	];

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


// Turn on server so heroku doesn't freak out
var port = process.env.PORT || 3000;
http.createServer().listen(port);

// We get 180 requests every 15 minutes, so let's check
// every 5 seconds or so.
setInterval(function(){
	console.log( ( (cooldownEnd - new Date().getTime()) / 1000 ) + " seconds to new tweet eligibility" );
	
	client.get('search/tweets', {q: 'jenner,he', result_type: "recent", since_id: since_id}, function(error, tweets, response){
		if( error ) console.log(error);
		else {

			since_id = tweets.search_metadata.max_id_str;
			
			tweets.statuses.forEach(function(tweet, i){
				if( tweet.text.indexOf("RT ") == -1 && 
					tweet.text.indexOf("RT:") == -1 &&
					tweet.text.toLowerCase().indexOf("transgender") == -1 &&
					tweet.text.toLowerCase().indexOf("fox news") == -1 &&
					tweet.text.toLowerCase().indexOf("\"she is\"") == -1 &&
					tweet.text.toLowerCase().indexOf("\"he\"") == -1 &&
					tweet.text.toLowerCase().indexOf("'he'") == -1 &&
					tweet.text.toLowerCase().indexOf("he/him") == -1 &&
					tweet.text.toLowerCase().indexOf("he/she") == -1 &&
					tweet.text.toLowerCase().indexOf("she/he") == -1 &&
					tweet.text.toLowerCase().indexOf("she_not_he") == -1 &&
					tweet.text.toLowerCase().indexOf("stop") == -1 &&
					tweet.text.toLowerCase().indexOf("drake") == -1 &&
					tweet.text.toLowerCase().indexOf("it's she") == -1) 
				{

					// Has enough time gone by since our last tweet?
					if( new Date().getTime() > cooldownEnd ){
						cooldownEnd = new Date().getTime() + cooldown;
						console.log(tweet.text);

						// Post the tweet
						client.post('statuses/update', {status: ".@" + tweet.user.screen_name + " " + bot_saying[getRandom( bot_saying.length - 1)], in_reply_to_status_id: tweet.id_str}, function(error, tweet, response){
							if( error ){
								console.log(error);
							} 
							else {
								console.log(tweet.text);
							}		
						});
					}
				}
			});
		}		
	});
},5100)

function getRandom(i) {
	return Math.floor(Math.random() * (i + 1) );
}
