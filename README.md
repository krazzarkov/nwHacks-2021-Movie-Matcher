# nwHacks-2021-Movie-Matcher

Simple Node.js website which allows two or more people to browse and pick movies that they mutually want to watch. Created for nwHacks 2021 hackathon. 

The Process:

1. User 1 picks a genre of movies and is given a session code
2. User 2 enters session code and joins User 1's session.
3. Both users are presented the same movie choices and can either like or dislike a movie.
4. After X amount of movies are browsed, the website shows both User 1 and 2 a list of movies which they both mutually liked.

This project uses Firebase to cache Netflix movies from the uNoGS API. Firebase is also used to store User sessions and movie choices.

The project was created in under 48 hours and is still VERY rough and unstable with a lot of bugs.
