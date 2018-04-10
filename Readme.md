### Property budder ###

A work-in-progress Node.js Express application which reverse-engineers the public facing REST APIs of www.domain.com.au, www.realestate.com.au, and www.flatmates.com.au in order to aggregate realestate listings.

This repo basically tells the story of me discovering how to JS.

Written initially in ES6 and transpiled to ES5, before I discovered the magic of async-await in ES7, after which point I also realised Typescript is even nicer (but still painful for more than a few edge cases).

I've mainly been fleshing out the API layer and getting my head around programmatically defining Express routes in a way that isn't painful to my eyes. Most recent work has gone into developing a core data model to unify the data I get from each provider to make life easier for the currently non-existent presentation layer.
