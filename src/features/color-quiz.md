---
sql:
  answers: ./data/color-quiz.json
---

```js
const answers = FileAttachment("./data/color-quiz.json").json();
```

```js
// display(answers);
```

# Color Quiz Answers

<br/>

## Correct identifications

How often are color filter results identified _correctly_ by observers?

```js
const plot = Plot.plot({
  marginLeft: 80,
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

How often are color filter results identified _incorrectly_ by observers?

```js
const plot = Plot.plot({
  marginLeft: 80,
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

## Average appraisal

How well do users judge the color results for a given color filter, based on the following scale:

| score | appraisal                        |
| ----- | -------------------------------- |
| 0     | no answer / color not identified |
| 1     | not so good                      |
| 2     | okay                             |
| 3     | great                            |

```js
const plot = Plot.plot({
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
