const fetch = require('node-fetch')

run(function *(){
    const url = 'http://jsonplaceholder.typicode.com/albums'
    // we need to fetch the data from this url. This is going to be
    // an asynchronous task, so rather than creating a call back to
    // handle it, let's pause the generator using yield, let our run
    // function resolve the promise, and wait for it to return the response
    // using .next()
    const response = yield fetch(url)

    // at this point we've received the response back, but if we
    // want the content of the response as json we need to call the
    // json method which returns another promise. From here we need
    // to hand off to our run function again so it can resolve the promise.
    const json = yield response.json()
    return json.map(album => console.log(album.title))
})

function run(generator){
    // note that when we fire our generator method here, it doesn't actually run the generator,
    // it just returns an iterator that will let us set through our generator until we get to the
    // next yield keyword.
    const iterator = generator()
    // This first `iterator.next()` call is what actually starts the running of the generator. When
    // we hit our yield statement, it sends in an iteration object. This object has two properties:
    // {value: ..., done: ...}. In our case, the value is the promise being returned from `fetch()`
    const iteration = iterator.next()
    // From here we can pull out the promise and handle it.
    const promise = iteration.value
    promise.then(response => {
        // at this point we've received the result of our promise. From here we
        // can pass the response back to our generator and let it do whatever it
        // needs to do. However, since we're tailor fitting this run function to our
        // generator we _know_ we're going to have a second promise coming in. So, we
        // fire next, passing the response back to our generator, knowing that another
        // yield statement will be passing us data again which we will assign here to
        // anotherIterator.
        const anotherIterator = iterator.next(response)
        const anotherPromise = anotherIterator.value
        anotherPromise.then(json => {
            iterator.next(json)
        })
    })
}