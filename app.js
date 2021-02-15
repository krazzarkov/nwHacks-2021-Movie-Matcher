const express = require('express')
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var engine = require('ejs-locals');
var fire = require('firebase-admin')
var serviceAccount = require("C:/googlekey/netflix-95ee6-firebase-adminsdk-iweh5-1f7a5392f6.json");

fire.initializeApp({     
    apiKey: "#APIKEYHERE",
    authDomain: "#",
    projectId: "#",
    storageBucket: "#",
    messagingSenderId: "#",
    appId: "#",
    credential: fire.credential.cert(serviceAccount)
});

var api = require("./api.js");

const firedb = fire.firestore()

genres = {
    "Adventure": 7442,
    "Action": 1568,
    "Drama" : 5763,
    "Comedy" : 10375,
    "Horror" : 83059,
    "Romantic" : 26156,
    "Thriller" : 5505
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

// async function cache() {
//     asyncForEach(Object.keys(genres), async (bruh) => {
//         api(genres[bruh]).then(data => {
//             firedb.collection("Genres").doc(bruh).set(data)
//         })
//     })
// }

// cache();

const app = express()

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.set('port', 3000);

// Set view folder.y
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// when app starts check list.json and store a date when it was retrieved, if the date is older than a week, run a query

app.get('/', function(req, res) {

    res.render(__dirname + "/views/home.html");

});

const sessionID = firedb.collection("Sessions")

app.get('/host/:id', function(req, res) {
    var code = String(Math.floor(100000 + Math.random() * 900000));
    var codeFire = firedb.collection("Sessions").doc(code);
    codeFire.get().then(result => {
        if(result.exists) {
            console.log("bruh this shit exists")
        } else {
            codeFire.set({"create": new Date(), "genre_id": req.params.id}).then(
                res.send(code)
            )
        }
    })

    // res.render(__dirname + "/views/session.html",{code:code});
})

app.get("/r/:id", function(req, res){

    firedb.collection("Sessions").doc(req.params.id).get().then(session_doc => {
        firedb.collection("Genres").doc(session_doc.data()["genre_id"]).get().then(movies => {

            var nfidmovies = {}
            for(var movie in movies.data().results){
                nfidmovies[movies.data().results[movie].nfid] = movies.data().results[movie]
            }
            //console.log(nfidmovies)

            var session_list = session_doc.data()
            //console.log(session_list)

            var liked_twice = {}
            for (var key in session_list){
                if (session_list[key] >= 2){
                    liked_twice[key] = nfidmovies[key]
                    //console.log(nfidmovies[key].title)
                }
            }

            res.render(__dirname + "/views/list.html", {liked_twice});
        })
    })
});

app.get("/s/:id", function(req, res){
    
    firedb.collection("Sessions").doc(req.params.id).get().then(session_doc => {
        firedb.collection("Genres").doc(session_doc.data()["genre_id"]).get().then(movies => {
            movie_info = movies.data()
            movie_info.code = req.params.id
            res.render(__dirname + "/views/session.html", movie_info)
        })
    })
});

app.get("/s/:id/:movie/:decision", function(req, res) {

    var movie = req.params.movie;
    var decision = req.params.decision;

    var movievote = 0;

    function convert(string) {
        if (string == "like") {
            return 1;
        } else{
            return 0;
        }
    }

    firedb.collection("Sessions").doc(req.params.id).get().then(movies => {
        var dbmovie = movies.data()[movie]
        
        if(dbmovie){
            movievote = dbmovie + convert(decision)
        } else {
            movievote = convert(decision)
        }

        var md = {
            [movie]: movievote
        };
    
        firedb.collection("Sessions").doc(req.params.id).set(md, {merge: true}).then(response => {
            console.log(movievote)
            res.send(String(movievote))
        });
    })
    
    //firedb.collection("Sessions").doc(req.params.id).get().then(movie_doc => {
        //movie_doc.data()[req.params.movie] + ((req.params.decision == 'like') ? 1 : 0)
    //});
    //firedb.collection("Sessions").doc(req.params.id).set({movie, (liked == "like") ? 1 : 0)})
});

app.get('/host', function(req, res) {

    var genreid = 0
    function genre(genre_title) {
        console.log(genres[genre_title])
    }
  
    res.render(__dirname + "/views/host.html");
  
});

app.get('/join', function(req, res) {

    res.render(__dirname + "/views/join.html");

});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});



