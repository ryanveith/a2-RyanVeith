## Arcade Style Soring Database
This project was inspired by the arcade scoreboards, so I created a simple way to store highscores from for different users. The game is not included in this project but you can have fun inserting, modifying and deleteing scores.
For positioning I used a flexbox set to diplay stuff in a row with space evenly since I wanted the scores to be visible ajacent to the "form" to imput new ones. Since this is arcade inspired the font was specifcly chosen so all characters take up the same space to allign the scores. 
The link to the website on render is: https://a2-shortstack-eqab.onrender.com/ 

## Technical Achievements
- **Singel Page Display - Tech Achievement 1**: I make the whole website 1 page by having the submit POST, request return the currernt server side data. I then reformatted it so it would look nice and had it overwrite the innerHTML of the list so the list would diplay up the current state of server side data.

- **Modifable Data - Tech Achievement 2**: I made it so you could modify and remove data instead of just adding it. To do this I created a dropdown menu for which version you are doing and then modifying the server so it can support removing data. To simplify modifing data the server just goes though the data and removes the data to modify and re-adds it.


### Design/Evaluation Achievements
- **Interview - Design Achievement 1**: 
1. Provide the last name of each student you conduct the evaluation with.
Newman
2. What problems did the user have with your design?
He disliked the how the fill in the blank box, the instruction text had to be deleted before you could type your own text. 
3. What comments did they make that surprised you?
He also commented on the black pink and blue color scheme which suprised  me a bit even though I know it is not exactly a normal color pallete.
4. What would you change about the interface based on their feedback?
I would set the instruciton text to use placeholder text instead of having it have an instruction value.

After making this quick change, I then did a second evalutation

- **Interview - Design Achievement 2**: 
1. Provide the last name of each student you conduct the evaluation with.
Plosky
2. What problems did the user have with your design?
No problems but a lot of feedback.
3. What comments did they make that surprised you?
That you could insert - numbers into the score. I had thought I made it so you could only do 0-999 but apparently not. They also put in decimals and that worked, which I had not considered. Finally they pointed out that showing the current state of the server at the start instead of waiting until you added your first score might be an improvment, which is not a suprise but still good feedback.
4. What would you change about the interface based on their feedback?
I would make it so - numbers are not valid. I also could get rid of decimal numbers but it is pretty funny to see them. If this were a super serious project I would use Math.floor but I think I will just leave it.


