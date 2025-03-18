---
#sql:
#  answers: ./data/color-quiz.json
---

```js
const answers = (await FileAttachment("./data/color-quiz.json").json()).map(
  (d) => ({ ...d, appraisal: d.appraisal ?? 0 })
);
```

```js
//display(answers);
```

# Color Quiz Answers

```js
const uniqueUsers = _.uniq(answers.map((a) => a.user_id));
```

Received **${answers.length}** answers from **${uniqueUsers.length}** unique users

<br/>

## Success rate

At what rate are color filter results identified _correctly_ by observers?

```js
const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray",
];

const successRates = colors.map((c) => {
  const actuals = answers.filter((a) => a.actual_color === c);
  const corrects = actuals.filter((a) => a.is_correct);
  const successRate = (100 * corrects.length) / actuals.length;
  return successRate;
});

const successRate = _.zip(colors, successRates).map(([actual_color, rate]) => ({
  actual_color,
  rate,
}));

const plot = Plot.plot({
  y: { domain: [0, 100] },
  marks: [
    Plot.barY(successRate, {
      x: "actual_color",
      y: "rate",
      fill: "actual_color",
      sort: { x: "-y" },
    }),
    Plot.text(successRate, {
      text: (d) => parseInt(d.rate) + "%",
      x: "actual_color",
      y: "rate",
      // fill: "actual_color",
      sort: { x: "-y" },
      dy: -10,
    }),
  ],
});

display(plot);
```

```js
const maxCorrect = _.max(
  Object.values(
    _.groupBy(
      answers.filter((d) => d.is_correct),
      (d) => d.actual_color
    )
  ).map((a) => a.length)
);

const maxIncorrect = _.max(
  Object.values(
    _.groupBy(
      answers.filter((d) => !d.is_correct),
      (d) => d.actual_color
    )
  ).map((a) => a.length)
);

const maxCorrectOrIncorrect = _.max([maxCorrect, maxIncorrect]);
```

<br/>

## Average appraisal

How well do users _judge_ the color results for a given color filter to be, based on the following scale:

| score | appraisal                        |
| ----- | -------------------------------- |
| 3     | great                            |
| 2     | okay                             |
| 1     | not so good                      |
| 0     | no answer / color not identified |

```js
const plot = Plot.plot({
  y: { domain: [0, 3] },
  marks: [
    Plot.barY(
      answers,
      Plot.groupX(
        { y: "mean" },
        {
          x: "actual_color",
          y: "appraisal",
          fill: "actual_color",
          tip: true,
          sort: { x: "-y" },
        }
      )
    ),
    Plot.text(
      answers,
      Plot.groupX(
        {
          y: "mean",
          text: (g) => _.mean(g.map((d) => d.appraisal)),
        },
        {
          x: "actual_color",
          y: "appraisal",
          // fill: "actual_color",
          sort: { x: "-y" },
          dy: -10,
        }
      )
    ),
  ],
});

display(plot);
```

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

## Correct identifications

How frequently are color filter results identified _correctly_ by observers?

```js
const plot = Plot.plot({
  marginLeft: 80,
  x: { domain: [0, maxCorrectOrIncorrect] },
  marks: [
    Plot.waffleX(
      answers.filter((a) => a.is_correct),
      Plot.groupY(
        { x: "count" },
        { y: "actual_color", fill: "actual_color", sort: { y: "-x" } }
      )
    ),
  ],
});

display(plot);
```

## Incorrect identifications

How frequently are color filter results identified _incorrectly_ by observers?

```js
const plot = Plot.plot({
  marginLeft: 80,
  x: { domain: [0, maxCorrectOrIncorrect] },
  marks: [
    Plot.waffleX(
      answers.filter((a) => !a.is_correct),
      Plot.groupY(
        { x: "count" },
        { y: "actual_color", fill: "actual_color", sort: { y: "-x" } }
      )
    ),
    Plot.text(
      answers.filter((a) => !a.is_correct),
      Plot.groupY(
        { x: () => 0, text: () => "X" },
        {
          y: "actual_color",
          dx: 10,
          fill: "red",
          stroke: "#fffc",
          fontWeight: "bold",
          fontSize: 16,
        }
      )
    ),
  ],
});

display(plot);
```

## By individual color

```js
const plot = Plot.plot({
  width,
  height: 200,
  x: {
    domain: [true, false],
  },
  marks: [
    Plot.barY(
      answers,
      Plot.groupX(
        {
          y: "count",
          fillOpacity: (g) => (g[0].is_correct ? 1 : 0.5),
          stroke: (g) => (g[0].is_correct ? "none" : "red"),
          strokeWidth: () => 2,
        },
        {
          x: "is_correct",
          fx: "actual_color",
          fill: "actual_color",
        }
      )
    ),
  ],
});

display(plot);
```
