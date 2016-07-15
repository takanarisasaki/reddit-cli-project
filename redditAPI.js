var inquirer = require('inquirer');
var functions = require('./reddit.js')
const imageToAscii = require("image-to-ascii");
var wrap = require('word-wrap');
var util = require('util');
var request = require("request");

// var getHomepage = require('getHomepage');
// var getSortedHomepage = require('getSortedHomepage');
// var getSubreddit = require('getSubreddit');
// var getSortedSubreddit = require('getSortedSubreddit');
// var getSubreddits = require('getSubreddits');

//console.log(util.inspect(testData, { showHidden: true, depth: null, colors: true }));


function findImage(url) {
    var urlLength = url.length;
    var urlExtention = url.substring(urlLength - 4, urlLength);
    //console.log(urlExtention);

    if (urlExtention === '.jpg' || urlExtention === '.gif' || urlExtention === '.png') {
        return true;
    }
}

// var url = 'https://octodex.github.com/images/octofez.png';
// console.log(findImage(url));


function openHomepage() {

    functions.getHomepage(function(error, response) {
        if (error) {
            console.log("There is an error!");
        }
        else {
            var importantHomepageInfo = [];

            response.forEach(function(obj) {
                var currentObject = {};
                currentObject.title = obj.data.title;
                currentObject.url = obj.data.url;
                currentObject.votes = obj.data.ups;
                currentObject.username = obj.data.name;
                importantHomepageInfo.push(currentObject);
            });

            //console.log("Default homepage posts as an array of objects", importantHomepageInfo);

            var homepageChoices = importantHomepageInfo.map(function(homepageObj) {
                return {
                    name: homepageObj.title,
                    value: homepageObj
                }
            });

            var mainMenu = {
                name: 'Back to main menu',
                value: 'menu'
            };

            homepageChoices.push(new inquirer.Separator());
            homepageChoices.push(mainMenu);
            homepageChoices.push(new inquirer.Separator());


            inquirer.prompt({
                //type is to make the actual list.
                type: 'list',
                name: "homepageList",
                message: "Choose a page",
                choices: homepageChoices
            }).then(
                function(answers) {

                    if (answers.homepageList === 'menu') {
                        console.log('\033[2J');
                        displayMenu();
                    }
                    else {
                        //This console.log clears the command line above
                        console.log('\033[2J');


                        //console.log("HELLO", answers.homepageList.url);
                        //check if the url is an image or else
                        if (findImage(answers.homepageList.url)) {

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

function openSubreddit() {
    inquirer.prompt({
        name: 'subreddit',
        message: 'Enter the name of the subreddit.'
    }).then(
        function(enteredValue) {
            //console.log("enteredValue", enteredValue.subreddit);

            functions.getSubreddit(enteredValue.subreddit, function(error, response) {
                //console.log(response)
                if (error) {
                    console.log("There is an error");
                }
                else {

                    var importantSubredditInfo = [];
                    response.forEach(function(obj) {
                        var currentObject = {};
                        currentObject.title = obj.data.title;
                        currentObject.url = obj.data.url;
                        currentObject.votes = obj.data.ups;
                        currentObject.username = obj.data.name;
                        importantSubredditInfo.push(currentObject);
                    });

                    var subredditChoices = importantSubredditInfo.map(function(homepageObj) {
                        return {
                            name: homepageObj.title,
                            value: homepageObj
                        }
                    });

                    var mainMenu = {
                        name: 'Back to main menu',
                        value: 'menu'
                    };

                    subredditChoices.push(new inquirer.Separator());
                    subredditChoices.push(mainMenu);
                    subredditChoices.push(new inquirer.Separator());

                    callSubredditList();

                    function callSubredditList() {

                        inquirer.prompt({
                            //type is to make the actual list.
                            type: 'list',
                            name: "subredditList",
                            message: "Choose a post",
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

function openSubreddits() {

    functions.getSubreddits(function(error, response) {
        if (error) {
            console.log("There is an error");
        }
        else {
            //console.log(response);

            var importantSubredditInfo = [];
            response.forEach(function(obj) {
                var currentObject = {};
                currentObject.title = obj.data.title;
                currentObject.url = 'https://www.reddit.com' + obj.data.url;
                currentObject.username = obj.data.name;
                importantSubredditInfo.push(currentObject);
            });

            //console.log(importantSubredditInfo);

            var subredditChoices = importantSubredditInfo.map(function(subredditObj) {
                return {
                    name: subredditObj.title,
                    value: subredditObj
                }
            });

            //console.log("HELLO", subredditChoices);

            var mainMenu = {
                name: 'Back to main menu',
                value: 'menu'
            };

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
        message: 'What do you want to do?',
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


//displayMenu();


function getAllComments(url) {
    //count the number of comments
    var counter = 0;
    //requestJson doesn't work here because of what we are trying to access
    request(url, function(err, res){
        var parsed = JSON.parse(res.body);
        // console.log(parsed[1].data.children);
        
        //at parsed[0] doesn't have any replies since it contains the post of the user       
        getComments(parsed[1].data.children);
        console.log("NUMBER OF COMMENTS", counter)
    })
    
    
    function getComments(data) {
       
        //console.log(util.inspect(data, { showHidden: true, depth: null, colors: true }));
        data.forEach(function(comment) {
            //if replies exist, call getComments (recursion) again
            if(comment.data.replies) {
                counter++;
                //body is where comments is stored
                console.log('\n')
                console.log(wrap(comment.data.body));
                //when we call getComments again, we need to make sure we are sending in an array, and children is an array of object
                getComments(comment.data.replies.data.children);
            } 
            else {
                counter++;
                console.log('\n')
                console.log(comment.data.body);
            }
               
        })
    }

}


getAllComments('https://www.reddit.com/r/pokemongo/comments/4suv8f/pokemon_before_and_now/.json');
//getAllComments('https://www.reddit.com/r/mcgill/comments/4s7qc9/my_laptop_and_ipad_stolen_in_ghetto/.json');
//getAllComments('https://www.reddit.com/r/mcgill/comments/4sk8t8/does_mount_royal_facilitate_trappingin_air/.json');





/*

// //var hello = wrap('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
// var hello = wrap('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', {width: 10});
// //wrap(hello, {indent: '      '});
// console.log(hello);


//THE COMMENTS ARE IN body


*/