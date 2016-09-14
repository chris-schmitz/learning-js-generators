const co = require('co')
const fetch = require('node-fetch')

// note that this is all the same code we wrote in the previous files,
// we're just not defining the tool we're using to run the generator,
// we're using co to do it.
co(function *(){
    const url = 'http://jsonplaceholder.typicode.com/albums'
    const response = yield fetch(url)
    const albums = yield response.json()
    console.log(albums.map(album => album.title))
})