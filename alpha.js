const request = require ('request');
const  cheerio = require('cheerio');
const fs = require('fs');
const natural = require ('natural');
const stopwords = require('stopwords-hu'); // array of stopwords

//supp.json

let robin = function (file){

  var NGrams = natural.NGrams;


//loop through all links and search for the values, which contains the snippet
//write 2 file
//get all texts...

am_db = JSON.parse(fs.readFileSync(file));

let mygrams = [];
let tri_gram = [];
let big_arr = [];

for (let i = 0; i < am_db.length ; i++) {
for (let j =0; j<6; j++){

  let title = am_db[i].titles;
let url = am_db[i].url[j];
let spt = am_db[i].spt[j];

console.log(title);
console.log(url);
console.log(spt);

//find('*:contains('+spt+')')

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        let $ = cheerio.load(body);

        //const words = $('body').filter(item => spt.includes(item)).text();
        const words = $('body').find('div:contains('+spt.slice(0,spt.length/4)+')').slice(2,5).text();
    

            let words_array = words.split(' ');
            words_array = words_array.filter(word => word.length>1);
            words_array = words_array.filter(item => !item.includes('\n'));
            words_array = words_array.filter(item => !stopwords.includes(item));

            //words_array = words_array.filter(item => spt.includes(item));

            tri_gram.push(NGrams.ngrams(words_array,3));
            
            let grammies = {titles: title, url: url, trigrams: tri_gram};
            mygrams.push(grammies);
            big_arr.push(words_array);
            
            fs.writeFileSync('mygrams.txt',JSON.stringify(big_arr.flat().join(',')));

            fs.writeFileSync('mygrams.json',JSON.stringify(mygrams));
      } else {
        reject(error);
      }
    });
  });
}

// Usage:

async function main() {
  let res = await doRequest(url);
  console.log(res);
}

main();
//var merged = big_arr.flat().join(',').split(',');
}
}
}

//fs.writeFileSync('mygrams.json',JSON.stringify(mygrams));

robin('supp.json');

module.exports.robin = robin;
