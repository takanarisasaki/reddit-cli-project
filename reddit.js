var request = require('request');

//JSON request
function requestAsJson(url, callback) {
	
	request(url, function(err, res) {
		if (err) {
			callback(err);
		}
		else {
			try {
				var response = JSON.parse(res.body);
				callback(null, response.data.children);
			}
			catch (e) {
				callback(e);
			}
		}
		
	});
}



//This function should "return" the default homepage posts as an array of objects.
function getHomepage(callback) {
  var URL_REDDIT = 'https://reddit.com/.json';
  
  requestAsJson(URL_REDDIT, function(err, response) {
	//console.log("BYE", response);
	if (err) {
	  console.log("There is an error!!");
	}
	
	else {
	  callback(null, response);
	  
	}
	
  });
  
}

// getHomepage(function(error, response){
//   if (error) {
//     console.log("There is an error!");
//   }
//   else {
//     console.log("Default homepage posts as an array of objects", response);
//   }
// });
  
  
  

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  
  var URL_SORT = 'https://www.reddit.com/' + sortingMethod + '/.json';
  
  requestAsJson(URL_SORT, function(error, response) {
	
	if (error) {
	  console.log("There is an error!");
	}
	else {
	  callback(null, response);
	}
	
	
  });
  
}

// getSortedHomepage('new', function(error, response) {
//   if (error) {
//     console.log("There is an error!");
//   }
//   else {
//     console.log(response);
//   }
  
// });



//This function should "return" the posts on the front page of a subreddit as an array of objects.
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  var URL_SUBREDDIT = 'https://www.reddit.com/r/' + subreddit + '/.json';
  console.log(URL_SUBREDDIT);
  
  requestAsJson(URL_SUBREDDIT, function(error, response) {
	if (error) {
	  console.log("There is an error!");
	}
	else {
	  callback(null, response);
	}
	
  });
}


// getSubreddit('pokemongo', function(error, response) {
//   if (error) {
//     console.log("There is an error");
//   }
//   else {
//     console.log(response);
//   }
// });



/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  
  var URL_SUBREDDIT_SORT = 'https://www.reddit.com/r/' + subreddit + '/' + sortingMethod + '/.json';
  //console.log(URL_SUBREDDIT_SORT);
  
  requestAsJson(URL_SUBREDDIT_SORT, function(error, response) {
	if (error) {
	  console.log("There is an error!");
	}
	else {
	  callback(null, response);
	}
  });
  
}

// getSortedSubreddit('pokemongo', 'new', function(error, response) {
//   if (error) {
//     console.log("There is an error!");
//   }
//   else {
//     console.log(response);
//   }
// })



//This function should "return" all the popular subreddits
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
  var URL_POPULAR_SUBREDDIT = 'https://www.reddit.com/subreddits/.json';
  
  requestAsJson(URL_POPULAR_SUBREDDIT, function(error, response) {
	if (error) {
	  console.log("There is an error!");
	}
	else {
	  callback(null, response);
	}
  });
}

// getSubreddits(function(error, response) {
//   if (error) {
//     console.log("There is an error");
//   }
//   else {
//     console.log(response);
//   }
// });




// Export the API
module.exports = {
	getHomepage: getHomepage,
	getSortedHomepage: getSortedHomepage,
	getSubreddit: getSubreddit,
	getSortedSubreddit: getSortedSubreddit,
	getSubreddits: getSubreddits
};









