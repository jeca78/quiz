/*-----------------------------------------------------------------------------
  REQUIRE
-----------------------------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')

/*-----------------------------------------------------------------------------
  THEME
-----------------------------------------------------------------------------*/
var FONT        = 'Lobster Two, cursive'
var BLACK       = 'hsla(0,0%,0%,1)'
var WHITE       = 'hsla(0,0%,100%,1)'
var YELLOW      = 'hsla(54,99%,53%,1)'
var ORANGE      = 'hsla(23,100%,63%,1)'
var RED         = 'hsla(1,100%,61%,1)'
var DARKRED     = 'hsla(354,45%,44%,1)'
var GREEN       = 'hsla(163,99%,55%,1)'
var LIGHTGREEN  = 'hsla(164,78%,77%,1)'
var GREY        = 'hsla(29,3%,50%,1)'
var PEACH       = 'hsla(351,84%,71%,1)'
var LIGHTPEACH  = 'hsla(0,48%,80%,1)'
var BABYVIOLET  = 'hsla(335,40%,83%,1)'
var VIOLET      = 'hsla(293,91%,73%,1)'
var LIGHTYELLOW = 'hsla(57,96%,83%,1)'
var MARINEBLUE  = 'hsla(236,100%,68%,1)'
var LIGHTBLUE   = 'hsla(236,100%,75%,1)'
var COFFIEGREY  = 'hsla(0, 0%, 88%, 1)'

/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = [
  'https://fonts.googleapis.com/css?family=Lobster Two',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
            ]
var font = yo`<link href= ${links[0]} rel='stylesheet' type='text/css'>`
var fontAwsome = yo`<link href= ${links[1]} rel='stylesheet' type='text/css'>`

document.head.appendChild(font)
document.head.appendChild(fontAwsome)

/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Statement #1:
The next social network I build,
will definitely be for cats.
`,
`
Statement #2:
I believe dogs should be allowed
everywhere people are
`,
`
Statement #3:
My friends say, my middle name should be "Meow".
`,
`
Statement #4:
Snoop Dog is definitely one of my
favourite artists
`,
`
Statement #5:
I think I could spend all day just
watching cat videows
`,
`
Statement #6:
I regularly stop people in the street
to pet their dogs.
`
]

var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]

/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color     : ${LIGHTBLUE};
      text-align           : center;
      font-family          : 'Lobster Two', cursive;
      padding-bottom       : 500px;
    }
    .welcome {
      font-size            : 5em;
      padding              : 50px;
      color                : ${YELLOW}
    }
    .question {
      font-size            : 3em;
      color                : ${LIGHTGREEN};
      padding              : 50px;
      margin               : 0 1%;
    }
    .answers {
      display              : flex;
      justify-content      : center;
      flex-wrap            : wrap;
      margin               : 0 5%;
    }
    .answer {
      background-color     : ${LIGHTPEACH};
      padding              : 15px;
      margin               : 10px;
      border               : 2px solid ${WHITE};
      border-radius        : 80%;
    }
    .answer:hover {
      background-color     : ${YELLOW};
      cursor               : pointer;
    }
    .instruction {
      color                : ${BLACK};
      font-size            : 2em;
      margin               : 0 5%;
      padding              : 10px;
    }
    .results {
      background-color     : ${COFFIEGREY};
      text-align           : center;
      font-family          : 'Lobster Two', cursive;
      padding-bottom       : 200px;
    }
    .resultTitle{
      font-size            : 4em;
      padding              : 50px;
      color                : ${DARKRED}
    }
    .back {
      display              : flex;
      justify-content      : center;
    }
    .backImg {
      height               : 30px;
      padding              : 5px;
      color                : ${BLACK};
    }
    .backText {
      color                : ${BLACK};
      font-size            : 35px;
    }
   .showChart {
      font-size            : 2em;
      color                : ${MARINEBLUE};
      margin               : 35px;
    }
    .showChart:hover {
      color                : ${LIGHTBLUE};
      cursor               : pointer;
    }
    .myChart {
      width                : 100px;
      height               : 100px;
      display              : center;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Welcome to my quiz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
         ${answerOptions.map(x=>yo`<div class="${css.answer}"       onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Choose how strongly do you agree with the statement<br>
          (1 - don't agree at all, 6 - completely agree)
        </div>
        <div class="${css.back}" onclick=${back}>
           <div class="${css.backText}">
           <i class="fa fa-step-backward" aria-hidden="true"></i>
           Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
  return function () {
    if (i < (questions.length-1)) {
      results[i] = id
      i = i+1
      question = questions[i]
      yo.update(element, template())
    } else {
      results[i] = id
      sendData(results)
      yo.update(element, seeResults(results))
      }
    }
  }
  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Compare your answers
      </div>
      <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Click to see the chart
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-a261a.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }
   function createChart(ctx, myData) {
    minixhr('https://quiz-a261a.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
      var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Statement #1", "Statement #2", "Statement #3",
          "Statement #4", "Statement #5", "Statement #6"
        ],
        datasets: [
          {
            label: "My statments",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Others statements",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
