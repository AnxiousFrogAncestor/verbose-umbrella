const Apify = require('Apify');
const fs = require('fs');
const supp = require ('./supp');

const { log } = Apify.utils;
log.setLevel(log.LEVELS.WARNING);
//execute the three functions
//read text file from alpha --> create topic models
//load trigrams--visualize? or just simply return the json
//make the user choose the input

let myJoker = function (keyword) {

    let kw = keyword;

let google_query = `https://www.google.com/search?q=${kw}&near=budapest`
console.log(google_query);

let rel_search = [];

let joker = Apify.main(async () => {
    const requestList = new Apify.RequestList({
        sources: [{ url: google_query },],
    });
    await requestList.initialize();
    const crawler = new Apify.CheerioCrawler({
        // Let the crawler fetch URLs from our list.
        requestList,

        handlePageFunction: async ({ request, html, $ }) => {
            console.log(`Processing ${request.url}...`);

            $('.card-section a').each((index, el) => {
                rel_search.push(
                     $(el).text(),
                );
            });
            
            },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed twice.`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();
    
    let cl_search = rel_search.filter(word => word.length>1);
    console.log('Crawler finished.');
    console.log(cl_search);
    let base_url = "https://www.google.hu/search?q="
    let bob = cl_search;

    //let new_links = cl_search.map((input)=>base_url+input);
    for (let index = 0; index < bob.length; index++) {
        bob[index] = {url: base_url+cl_search[index]};
    }
    fs.writeFileSync('beta.json',JSON.stringify(bob));
    console.log(supp.batman);
});
}

/* let beta_file = fs.readFileSync('beta.json'); */

async function inward () {return supp.batman;}

myJoker('bce');

/* if (!beta_file.includes=='undefined'){
    inward;
} else {
    console.log(JSON.parse(beta_file));
    myJoker('toyota',inward);
    console.log('error!!!');
    inward;
}; */


module.exports.myJoker = myJoker;