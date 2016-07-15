var inquirer = require('inquirer');
var functions = require('./reddit.js')
const imageToAscii = require("image-to-ascii");
var wrap = require('word-wrap');
var util = require('util');
var request = require("request");
var colors = require('colors');
var emoji = require('node-emoji');

// var getHomepage = require('getHomepage');
// var getSortedHomepage = require('getSortedHomepage');
// var getSubreddit = require('getSubreddit');
// var getSortedSubreddit = require('getSortedSubreddit');
// var getSubreddits = require('getSubreddits');

//console.log(util.inspect(testData, { showHidden: true, depth: null, colors: true }));


//returns true if the url is an image
function findImage(url) {
    var urlLength = url.length;
    //store the last four letters of the url into urlExtension
    var urlExtention = url.substring(urlLength - 4, urlLength);
    //console.log(urlExtention);
    if (urlExtention === '.jpg' || urlExtention === '.gif' || urlExtention === '.png') {
        return true;
    }
}

//Make an object that is used to make an option to bring back to main menu
function backToMainMenu() {
    var mainMenu = {
        name: 'Back to main menu'.green,
        value: 'menu'
    };
    return mainMenu;
}

//Starts here
function displayMenu() {

    var menuChoices = [{
        name: 'Show homepage',
        value: 'HOMEPAGE'
    }, {
        name: 'Show subreddit',
        value: 'SUBREDDIT'
    }, {
        name: 'List subreddits',
        value: 'SUBREDDITS'
    }];

    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What do you want to do?'.red,
        choices: menuChoices
    }).then(
        function(answers) {

            //console.log(answers);
            //console.log(answers.menu);
            //What the user enter is in answers.menu

            if (answers.menu === 'HOMEPAGE') {
                openHomepage();
            }
            if (answers.menu === 'SUBREDDIT') {
                //What we enter in prompt has the properties name and message
                //What we enter in prompt is the object that has the property subreddit, which contains a name
                openSubreddit();
            }
            if (answers.menu === 'SUBREDDITS') {
                openSubreddits()
            }

        });

}

//Show a list of homepage posts
function openHomepage() {

    functions.getHomepage(function(error, response) {
        if (error) {
            console.log("There is an error!");
        }
        else {
            //make an array of object which in each object contains a summary of important info of the page
            var importantHomepageInfo = response.map(function(obj) {
                var currentObject = {};
                currentObject.title = obj.data.title;
                currentObject.url = obj.data.url;
                currentObject.votes = obj.data.ups + ' ' + emoji.get('thumbsup');
                currentObject.username = obj.data.name;
                return currentObject;
            });

            //console.log("Default homepage posts as an array of objects", importantHomepageInfo);
            
            //make a choice object to use it in inquirer.prompt, which NEEDS the properties name and value
            var homepageChoices = importantHomepageInfo.map(function(homepageObj) {
                return {
                    name: homepageObj.title,
                    value: homepageObj
                }
            });
            
            //make an object main menu
            var mainMenu = backToMainMenu();
            
            //add separators between the main menu option
            homepageChoices.push(new inquirer.Separator());
            homepageChoices.push(mainMenu);
            homepageChoices.push(new inquirer.Separator());


            inquirer.prompt({
                //type is to make the actual list.
                type: 'list',
                name: "homepageList",
                message: "Choose a post:".red,
                choices: homepageChoices
            }).then(
                function(answers) {
                    //console.log(answers);

                    if (answers.homepageList === 'menu') {
                        //This console.log clears the command line above
                        console.log('\033[2J');
                        displayMenu();
                    }
                    else {
                        console.log('\033[2J');

                        //console.log("HELLO", answers.homepageList.url);
                        //check if the url is an image or else by calling findImage() function
                        if (findImage(answers.homepageList.url)) {
                            
                            //make an image of a web page into ASCII on commandline
                            imageToAscii(answers.homepageList.url, (err, converted) => {
                                console.log(err || converted);
                            });
                            console.log('\n');
                            openHomepage()
                        }

                        else {
                            console.log(answers.homepageList);
                            console.log('\n');
                            openHomepage();
                        }
                    }
                });

        }
    });
}

//Enter a name of subreddit
function openSubreddit() {
    inquirer.prompt({
        name: 'subreddit',
        message: 'Enter the name of the subreddit:'.red
    }).then(
        function(enteredValue) {
            //console.log("enteredValue", enteredValue.subreddit);

            functions.getSubreddit(enteredValue.subreddit, function(error, response) {
                //console.log(response)
                if (error) {
                    console.log("There is an error");
                }
                else {
                    var importantSubredditInfo = response.map(function(obj) {
                        var currentObject = {};
                        currentObject.title = obj.data.title;
                        currentObject.url = obj.data.url;
                        currentObject.votes = obj.data.ups + ' ' + emoji.get('thumbsup');
                        currentObject.username = obj.data.name;
                        return currentObject;
                    });

                    var subredditChoices = importantSubredditInfo.map(function(homepageObj) {
                        return {
                            name: homepageObj.title,
                            value: homepageObj
                        }
                    });

                    var mainMenu = backToMainMenu();
                    
                    subredditChoices.push(new inquirer.Separator());
                    subredditChoices.push(mainMenu);
                    subredditChoices.push(new inquirer.Separator());

                    callSubredditList();

                    function callSubredditList() {

                        inquirer.prompt({
                            //type is to make the actual list.
                            type: 'list',
                            name: "subredditList",
                            message: "Choose a post:".red,
                            choices: subredditChoices
                        }).then(
                            function(answers) {

                                if (answers.subredditList === 'menu') {
                                    console.log('\033[2J');
                                    displayMenu();
                                }
                                else {

                                    if (findImage(answers.subredditList.url)) {
                                        imageToAscii(answers.subredditList.url, (err, converted) => {
                                            console.log(err || converted);
                                        });
                                        console.log('\n');
                                        callSubredditList();
                                    }

                                    else {
                                        console.log('\033[2J');
                                        console.log(answers.subredditList);
                                        console.log('\n');
                                        callSubredditList();
                                    }

                                }
                        });
                    }

                }
            });
        }
    );

}

//Show a list of subreddits
function openSubreddits() {

    functions.getSubreddits(function(error, response) {
        if (error) {
            console.log("There is an error");
        }
        else {
            //console.log(response);

            var importantSubredditInfo = response.map(function(obj) {
                var currentObject = {};
                currentObject.title = obj.data.title;
                currentObject.url = 'https://www.reddit.com' + obj.data.url;
                currentObject.username = obj.data.name;
                return currentObject;
            });

            //console.log(importantSubredditInfo);

            var subredditChoices = importantSubredditInfo.map(function(subredditObj) {
                return {
                    name: subredditObj.title,
                    value: subredditObj
                }
            });

            //console.log("HELLO", subredditChoices);

            var mainMenu = backToMainMenu();

            subredditChoices.push(new inquirer.Separator());
            subredditChoices.push(mainMenu);
            subredditChoices.push(new inquirer.Separator());

            //  UNTIL HERE IS GOOD

            inquirer.prompt({
                //type is to make the actual list.
                type: 'list',
                name: "subredditList",
                message: "Choose a subreddit",
                choices: subredditChoices
            }).then(
                function(answers) {
                    //console.log("HELLO", answers);

                    if (answers.subredditList === 'menu') {
                        console.log('\033[2J');
                        displayMenu();
                    }
                    else {
                        console.log('\033[2J');
                        console.log(answers.subredditList);
                        console.log('\n');
                        openSubreddits();
                    }
                });

        }

    });
}


displayMenu();


function getAllComments(url) {
    console.log('\n')
    //count the number of comments
    var counter = 0;
    //requestJson doesn't work here because of what we are trying to access
    request(url, function(err, res){
        var parsed = JSON.parse(res.body);
        //print what the person who made the post wrote
        console.log(("TITLE: " + parsed[0].data.children[0].data.title).green.bold.underline + '\n');
        //at parsed[0] doesn't have any replies since it contains the post of the user
        console.log(parsed[0].data.children[0].data.selftext.green.bold + '\n');
        console.log(('NUMBER OF COMMENTS: ' + parsed[0].data.children[0].data.num_comments).red.bold + '\n');
        // console.log(parsed[1].data.children);
        getComments(parsed[1].data.children, null, 0);
        console.log('NUMBER OF COMMENTS', counter);
    })
    
    
    function getComments(data, isReply, level) {
           
        //console.log(util.inspect(data, { showHidden: true, depth: null, colors: true }));
        data.forEach(function(comment) {
            var indentSpace = '';
            
            for (var i = 0; i <= level; i++){
                indentSpace = indentSpace + '       ';
            }
            //if replies exist, call getComments (recursion) again
                        //At this point, empty string is false, so this if statement is executed
            if (!isReply) {;
                console.log('_____________________'.yellow + "\n");
            }
            
            if(comment.data.replies) {
                counter++;
                //body is where comments is stored

                var reply = comment.data.body;
                console.log(wrap(reply, {indent: indentSpace}).yellow.bold + "\n");
                //when we call getComments again, we need to make sure we are sending in an array, and children is an array of object
                getComments(comment.data.replies.data.children, true, level + 1);
                
            } 
            else {
                counter++;
                console.log(wrap(comment.data.body, {indent: indentSpace}).yellow.bold + "\n");
                
            }

        });
    }

}


//getAllComments('https://www.reddit.com/r/pokemongo/comments/4suv8f/pokemon_before_and_now/.json');
//getAllComments('https://www.reddit.com/r/mcgill/comments/4s7qc9/my_laptop_and_ipad_stolen_in_ghetto/.json');
//getAllComments('https://www.reddit.com/r/mcgill/comments/4sk8t8/does_mount_royal_facilitate_trappingin_air/.json');
//getAllComments('https://www.reddit.com/r/mcgill/comments/skqfc/any_interest_in_compiling_a_list_of_mcgill_life/.json');