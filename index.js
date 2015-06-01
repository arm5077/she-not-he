var Twitter = require('twitter');
var http = require('http');

	var request_count = 450; 
	var tweet_count = 100;
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


// Turn on server
var port = process.env.PORT || 3000;
http.createServer().listen(port);


setInterval(function(){
	
	// We get another Twitter request back.
	request_count++;

	// We accrue our twitter posts back;
	tweet_count += .25
	
	if(request_count > 0){
		// We used a Twitter request
		request_count--;
		
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
						tweet.text.toLowerCase().indexOf("it's she") == -1 &&
						tweet_count > 0) {

							// Wrap this in a timeout so we don't overload Twitter with tweets.
							setTimeout(function(){
								console.log(tweet.text);

								// Dock us a tweet
								tweet_count--;

								// Post the tweet
								client.post('statuses/update', {status: ".@" + tweet.user.screen_name + " " + bot_saying[getRandom( bot_saying.length - 1)], in_reply_to_status_id: tweet.id_str}, function(error, tweet, response){
									if( error ){
										console.log(error);
										if(error.code == 226){

										}
									} 
									else {
										console.log(tweet.text);
									}		
								});

							}, 15000 * (i+1))
						}
				});
			}		
			
		});
		
	}
	
},10000)

function getRandom(i) {
	return Math.floor(Math.random() * (i + 1) );
}
