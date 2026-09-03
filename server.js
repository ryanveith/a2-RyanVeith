const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const serverdata = [ 
  { 'username': 'ryan', 'abbriviation': 'RYN', 'highscore': '531', 'date': '2026-08-31'},
  { 'username': 'There Can Only Be 1', 'abbriviation': 'THE', 'highscore': '488', 'date': '2026-08-31'},
  { 'username': 'Starbright', 'abbriviation': 'STA', 'highscore': '091', 'date': '2026-08-31'},
  { 'username': 'Giles Corey', 'abbriviation': 'GIL', 'highscore': '047', 'date': '2026-08-31'},
  { 'username': 'Bob Smith', 'abbriviation': 'BOB', 'highscore': '004', 'date': '2026-08-31'}
]


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
    if (data.username === "ryan") {
      data.abbriviation = "RYN"
    }
    else {
      data.abbriviation = data.username.slice(0,3).toUpperCase().padStart(3, "-")
    }

    // Make sure score is valid and format it
    if (Number.isNaN(Number(data.highscore))) {
      data.highscore = 0
    }
    if (data.highscore > 999) {
      data.highscore = 999
    }
    if (data.highscore < 0) {
      data.highscore = 0
    }
    data.highscore = String(data.highscore).padStart(3, "0")


    // Second derived attribute is current ranking compared to other scores
    // This requires going though data and not only comparing scores but also updating other rankings
    let indexToPlace = null
    let indexToRemove = null
    for (let index = 0; index < serverdata.length; index++) {
      if (data.option !== "Delete Score" && indexToPlace === null) {
        // Check if this is the spot to add the "new" score
        if (Number(serverdata[index].highscore) <= Number(data.highscore)) {
          indexToPlace = index
        }
      }
      if (serverdata[index].username === data.username) {
        //This score either needs to be updated, removed, or is end of search
        if (data.option === "Modify Score" || data.option === "Delete Score") {
          // Remove the current score
          indexToRemove = index
        }
        else if (data.option === "Add Score") {
          if (indexToPlace !== null) {
            // We already added a score remove the worse one, otherwise don't bother adding a non-highscore
            indexToRemove = index
          }
          else {
            indexToPlace = "Skip This"
          } 
        }
      }
    }
    // Place scores now that we are done iterating
    if (data.option === "Add Score" || (data.option === "Modify Score" && indexToRemove !== null)){
      // Place new score
      if (indexToPlace === "Skip This") {
        // Special case we did not place the score only pretended to since it was not a highscore
        indexToPlace = null
      }
      else if (indexToPlace === null) {
        // Append new lowscore to bottom of the list
        indexToPlace = serverdata.length
        data.ranking = indexToPlace + 1
        serverdata.push(data)
        
      }
      else {
        data.ranking = indexToPlace + 1
        serverdata.splice(indexToPlace, 0, data)
      }
    }
    // Remove scores now that we are done iterating
    if (indexToRemove !== null) {
      // If this is after we added a index go 1 index further
      if (indexToPlace !== null && indexToPlace <= indexToRemove) {
        indexToRemove++
      }
      serverdata.splice(indexToRemove, 1)
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
