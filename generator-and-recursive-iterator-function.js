let fetch = require('node-fetch')

run(function *(){
    const url = 'http://jsonplaceholder.typicode.com/albums'
    const response = yield fetch(url)
    const albums = yield response.json()
    console.log(albums.map(album => album.title))
})

function run(generator){
    // get our generator function and extract it's iterator
    const iterator = generator()

    // Create a function that allows us to recursively step through our iterations
    // that we'll call further down in the run function. A small aside: note that
    // because this function exists within the run function, it's scoped to run, i.e.
    // you can't access the iterate function from outside of run, turning it into a private
    // method (if you want to think of it that way).
    function iterate(iteration){
        // look inside the iteration. If it's done, i.e. we've satisfied all of the yields,
        // then return the value.
        if(iteration.done){
            return iteration.vaule
        }

        // if we're not on the last iteration, pull out that iteration's promise (this run
        // function is meant to work specifically with promises only). Note that at this point
        // the promise is already running, we just haven't defined a catch for it (confirm that this
        // is a true statement).
        const promise = iteration.value

        // Then we satisfy the promise and in its then catch, we advance till the next iteration,
        // (iterator.next()) and pass that advance into our iterate function recursively.
        // I like how compact this line is so I'm not going to expand it in the live code to better
        // annotate it, but I'll do it here in the comment:
        //
        // in es6 terms, this is what's happening:
        //
        // return promise().then(function(response) {
        //    return iterate(iterator.next(response))
        // })
        //
        return promise.then(response => iterate(iterator.next(response)))
    }

    // Now that we've defined iterate, we need to actually kick off the generator function (remember,
    // the `generator()` call at the top of this function does not start the generator running, it just
    // returns an iterator. We need to make the first `iterator.next()` call to actually start iterating).
    return iterate(iterator.next())
}