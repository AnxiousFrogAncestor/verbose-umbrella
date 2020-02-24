const Apify = require('Apify');
const fs = require('fs');

const { log } = Apify.utils;
log.setLevel(log.LEVELS.WARNING);

//gamma.myJoker;

//problem statement: get a list of the Google snippets, their corresponding query titles, and their links, save that to JSON so the other programs can access that
//pseudo-code: read the links from beta.json, 
//for each (Google) link:
//get the title, first 3 snippets and urls, separately
//finally, write it to JSON data

    //bobby = JSON.parse(fs.readFileSync('beta.json'));

    //let alice = [];
    
    //onsole.log(bobby);
//execute the three functions
//read text file from alpha --> create topic models
//load trigrams--visualize? or just simply return the json
//make the user choose the input

let batman = Apify.main(async () => {

    let alice = [];
    const requestList = new Apify.RequestList({
        sources: JSON.parse(fs.readFileSync('beta.json')),
    });
    await requestList.initialize();
    const crawler = new Apify.CheerioCrawler({
        // Let the crawler fetch URLs from our list.
        requestList,

        handlePageFunction: async ({ request, html, $ }) => {
            console.log(`Processing ${request.url}...`);

            //query titles
            const title = $('title').text();

            //new q_links

            let q_links = [];

            $('.r a').each((index, el) => {
                q_links.push(
                     $(el).attr('href'),
                );
            });

            q_links = q_links.filter(item => item !== '#');
            q_links = q_links.filter(item => !item.includes('webcache'));
            q_links = q_links.filter(item => !item.includes('related:'));


            //new snippets
            //const q_snippets=$('.st').slice(0,3).text();

            const q_snippets = [];
            $('.st').each((index, el) => {
                q_snippets.push(
                     $(el).text().replace('...',""),
                );
            });



            ///the user sees this: [query_title]-> [urls]-> [texts]->[topics]
            ///join title+snippet+url [{url: xxx, title: yyy, spt: zzz}]
    

            var search_res = {titles: title, url: q_links.slice(0,6), spt: q_snippets.slice(0,6)};
            alice.push(search_res);
            
            },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed twice.`);
             },
            });

    // Run the crawler and wait for it to finish.
    await crawler.run();
    console.log(alice);
    await fs.writeFileSync('supp.json',JSON.stringify(alice));

});

batman;

module.exports.batman = batman;
