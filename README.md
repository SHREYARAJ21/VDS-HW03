<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
body{
    background-color: rgb(38, 37, 37);
    color: wheat;
}
            #navigation {
                background-color: #454545;
                height:30px;
                font-size: 30px;
                
            }
            h2 {
                text-align: center;
                background-color: rgb(38, 37, 37);
                color:white;
                font-size: 50px;
                }
                
        img {
          margin-left: auto;
          margin-right: auto;
          padding-left: 50px;
          width: 250px;
            height: 200px;
        }
a {
            color: white;
            text-decoration: none;

                }

        </style>
        <script type="text/javascript">
            function display_para1() {
                var text1 = document.getElementsByClassName('para1')[0];
                var text2 = document.getElementsByClassName('para2')[0];
                if (text1.style.display == 'block') {
                    text1.style.display = 'none';
                }else{
                    text1.style.display = 'block';
                    text2.style.display = 'none';
                }
            } 
            function display_para2() {
                var text2 = document.getElementsByClassName('para2')[0];
                var text1 = document.getElementsByClassName('para1')[0];
                if (text2.style.display == 'block') {
                    text2.style.display = 'none';
                }else{
                    text2.style.display = 'block';
                    text1.style.display = 'none';
                }
            } 
        </script>
        <h2>ABOUT ME</h2>
        </head>
<body>
    <p id="navigation" align="right">
        <a href="HW0.html">About Me</a>&emsp;
        <a href="visualization.html">Visualization</a>&emsp;
    <a href="credits.html">Credits</a>&emsp;
    <a href="svg.html">SVG CANVAS</a>&emsp;
    <a href="hw02.html">BLACK HAT</a>&emsp;
    <a href="white_hat.html">WHITE HAT</a>&emsp;
        <a href="HW3.html">HOME WORK 3</a>&emsp;
    </p>
    <p>
        <img src="image.png" alt="Headshot">
        </p>


<p id="p1"> 

        <h3 onClick= display_para1()>Click Here to Learn About Me!</h3>
        <p class= 'para1' style="display:none;color:white; padding-left: 450px;">Hi,
            I am Shreya Raj Kati, a MSCS student. I am in the third semester of my course and I will be graduating in May 2023. My main interests are in Software Development and Data Science.
            I completed my Bachelors in Computer Science and Engineering in India. I also worked as a Programmer Analyst in Cognizant, till August 2021, when I decided to pursue my Masters in US.
            I am also interested in computer graphics and game development.
            <br/>
        </p>


       
    
  </p>
  <p id="p2">
    <div class="paragraph_2">
        <h3 onClick= display_para2()>Fun Facts About Me!(click to view)</h3>
        <ul class= 'para2' style="display:none;color:white;padding-left: 450px;">

            <li>I am from Hyderabad, a city in South India</li>
            <li>I like to read novels and paint</li>
            <li>I like working on projects that have a positive impact on people around me</li>
            <li>I used to play tennis and almost considered having a career in it before coming across the wonderful field of computer science</li>
        </ul>
    </div>

  
</body>
</html>

