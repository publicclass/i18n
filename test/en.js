module.exports = {
  i: { can: { haz: "localization" } },
  embedded: "With some <%= i.can.haz %> from the locale file.",
  script: "Print a number: <%= 12*5 %> = 60?!"
}