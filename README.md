FreeCodeCamp API Basejump: URL Shortener Microservice

    User stories:

        I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

    When I visit that shortened URL, it will redirect me to my original link.

Example creation usage:
https://url-shortener-microservice-fcc-computerluca.c9users.io/new/http://www.google.com
Example creation output
{"old_url":"http://www.google.como","new":"SJ2ccust"}
Usage:
https://url-shortener-microservice-fcc-computerluca.c9users.io/SJ2ccust
Will redirect to:
https://www.google.com/
You can also use the route /delete/:name to delete a url.
https://url-shortener-microservice-fcc-computerluca.c9users.io/delete/SJ2ccust
To delete a link you have to pass the minified url to the route delete



