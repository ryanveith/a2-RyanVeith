// FRONT-END (CLIENT) JAVASCRIPT HERE
//let ul = null

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const mode = document.querySelector( '#option' ),
        username = document.querySelector( '#username' ),
        score = document.querySelector( '#highscore' ),
        today = new Date().toISOString().slice(0, 10), 
        json = { option: mode.value, username: username.value, highscore: score.value, date: today},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  console.log("here")
  const data  = JSON.parse(text)
  let dataToDisplay = ""
  // You could also do this with innerText, but I am using innerHTML
  // The for right now this will work method we discussed in class
  //ul = document.getElementById('scoretable')
  //ul.innerHTML = ""
  for (let i = 0; i < data.length; i++) {
    let ending = "th"
      if (i == 0) {
        ending = "st"
      }
      else if (i == 1) {
        ending = "nd"
      }
      else if (i == 2) {
        ending = "rd"
      }

      // const li = document.createElement('li')
      // li.innerText = item.yourname
      // ul.appendChild(li)
      // Should probably add a string.replaceAll to prevent <script> from being inserted
      dataToDisplay += `<li> ${data[i].ranking}${ending} place Player: ${data[i].abbriviation} Score: ${data[i].highscore} on ${data[i].date} by ${data[i].username}</li>`
  }
  // Overwrite the displayed scoretable with the updated version after it returns
  document.getElementById('scoretable').innerHTML = dataToDisplay.replaceAll(/(<[^l][^i][^>])|([^<][^l][^i]>)/g, "")
}

window.onload = function() {
  const button = document.querySelector('button')
  button.onclick = submit 
}
