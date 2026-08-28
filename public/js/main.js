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
        today = new Date().toISOString().slice(0, 10), 
        json = { yourname: playername.value, username: username.value, highscore: score.value, date: today},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  console.log("here")
  const data  = JSON.parse(text)
  let dataToDisplay = ""
  for (let i = 0; i < data.length; i++) {
      dataToDisplay += `<li> Ranking: ${data[i].ranking} Player: ${data[i].abbriviation} Score: ${data[i].highscore} on ${data[i].date} by ${data[i].yourname}</li>`
  }
  // Overwrite the displayed scoretable with the updated version after it returns
  document.getElementById('scoretable').innerHTML = dataToDisplay
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit
}
