// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const playername = document.querySelector( '#yourname' ),
        username = document.querySelector( '#username' ),
        score = document.querySelector( '#highscore' ),
        json = { yourname: playername.value, username: username.value, highscore: score.value},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()

  console.log( 'text:', text )
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
}
