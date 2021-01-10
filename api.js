//export function API() {
module.exports = async function API(id) {
    var unirest = require("unirest");
    // 5a8b5522a4msh449823e10fdc62cp1dddc0jsnd873c8d02a45
    // var req = unirest("GET", "https://unogsng.p.rapidapi.com/search");
    return new Promise(resolve => {
        unirest
        .get("https://unogsng.p.rapidapi.com/search")
        .headers(
            {"x-rapidapi-key": "5a8b5522a4msh449823e10fdc62cp1dddc0jsnd873c8d02a45",
                "x-rapidapi-host": "unogsng.p.rapidapi.com",
                "useQueryString": true
            })
        .query({
            "newdate": "1999-01-06",
            "genrelist": id,
            "start_year": "1972",
            "orderby": "rating",
            "limit": "50",
            "subtitle": "english",
            "audio": "english",
            "offset": "0",
            "end_year": "2019"
        })
        .then((response) => {
            resolve(response.body);
        });
    })


    // req.query({
    //     "newdate": "1999-01-06",
    //     "genrelist": id,
    //     "start_year": "1972",
    //     "orderby": "rating",
    //     "limit": "30",
    //     "subtitle": "english",
    //     "audio": "english",
    //     "offset": "0",
    //     "end_year": "2019"
    // });
    
    // req.headers({
    //     "x-rapidapi-key": "0ddec56684mshc3ccb5aa2df4826p162a44jsn08782c689736",
    //     "x-rapidapi-host": "unogsng.p.rapidapi.com",
    //     "useQueryString": true
    // });
    
    
    // req.end(function (res) {
    //     if (res.error) throw new Error(res.error);
    //     console.log(res.body)
    // });
    
    
}

// Host Code -> Users HWID -> Lieks & Dislikes
// Results Page