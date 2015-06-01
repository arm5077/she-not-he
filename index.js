var Twitter = require('twitter');

	var request_count = 450; 
	var since_id = 0;
	var bot_saying = ["Beep beep! It's she, not he.", 
		"Booooop! It's she, not he.", 
		"Beepbopbeep! It's she, not he.", 
		"~ROBOT CLANKING NOISE~ It's she, not he."
	];

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


setInterval(function(){
	
	// We get another Twitter request back.
	request_count--;

	if(request_count > 0){
		// We used a Twitter request
		request_count++;
		
		client.get('search/tweets', {q: 'jenner,he', result_type: "recent", since_id: since_id}, function(error, tweets, response){
			if( error ) throw error;
			
			since_id = tweets.search_metadata.max_id_str;
			console.log(since_id);
			
			tweets.statuses.forEach(function(tweet){
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
					tweet.text.toLowerCase().indexOf("it's she") == -1) {
						console.log(tweet.text);
					}

			});
		});
		
	}
	
},2100)

