const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
  { 'model': 'honda', 'year': 2004, 'mpg': 30 },
  { 'model': 'ford', 'year': 1987, 'mpg': 14} 
]

const serverdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const data = JSON.parse( dataString )
    // ... do something with the data here!!!
    
    // 3 Letter abbriviation for your username
    // Derived automatically
    data.abbriviation = data.username.slice(0,3).toUpperCase()

    // Make sure score is valid and format it
    if (Number(data.highscore) === NaN) {
      data.highscore = 0
    }
    if (data.highscore > 999) {
      data.highscore = 999
    }
    data.highscore = String(data.highscore).padStart(3, "0")


    // Second derived attribute is current ranking compared to other scores
    // This requires going though data and not only comparing scores but also updating other rankings
    let placedscore = null
    let indexToRemove = null
    console.log("Start")
    for (let index = 0; index < serverdata.length; index++) {
      if (data.option !== "Delete Score") {
        // Check if this is the spot to add the "new" score
        if (Number(serverdata[index].highscore) <= Number(data.highscore)) {
          data.ranking = index + 1
          placedscore = index
          console.log("placed score", index)
        }
      }
      if (serverdata[index].username === data.username) {
        console.log("HI")
        //This score either needs to be updated, removed, or is end of search
        // Add/Remove/Modify Score
        if (data.option === "Modify Score" || data.option === "Delete Score") {
          // Remove the current score
          indexToRemove = index
        }
        if (data.option === "Add Score") {
          if (placedscore !== null) {
            // We already added a score remove the worse one, otherwise don't bother adding a non-highscore
            indexToRemove = index
            console.log("plan remove")
            break
          }
          console.log(index, indexToRemove)
          placedscore = "Skip This"
          break
        }
      }
      if (placedscore !== null && indexToRemove !== null) {
        // No other scores will change so don't bother finishing
        console.log("DONE")
        break
      }
    }
    if (placedscore === null && (data.option !== "Delete Score")) {
      // Append new lowscore to bottom of the list
      data.ranking = serverdata.length + 1
      serverdata.push(data)
      placedscore = serverdata.length
    }
    else {
      // Append new scores after we are done iterating though the array
      if (placedscore === "Skip This") {
        // Special case we did not place the score only pretended to since it was not a highscore
        placedscore = null
        console.log("WTH")
      }
      else {
        serverdata.splice(placedscore, 0, data)
      }
    }
    // Remove stuff from the array now that we are done iterating though its
    if (indexToRemove !== null) {
      // if this is after we added a index go 1 index further
      if (placedscore !== null && placedscore <= indexToRemove) {
        indexToRemove++
        console.log("hello")
      }
      serverdata.splice(indexToRemove, 1)
      console.log("REMOVING INDEX", indexToRemove)
    }
    
    // Iterate though the array agian and update rankings
    // The efficiency of only going though the array once was not worth the
    // potential errors of doing this during editing the array
    for (let index = 0; index < serverdata.length; index++) {
      serverdata[index].ranking = index + 1
    }

    // console.log("returning data")
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })

    // change this to incorporate data
    response.end(JSON.stringify(serverdata))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
