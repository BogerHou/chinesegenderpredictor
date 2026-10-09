# Chinese Gender Predictor

[Chinese Gender Predictor](https://chinesegenderpredictor.net/) is a free, privacy-conscious tool for exploring the traditional Chinese gender calendar. Enter a birth date and an estimated conception date, or use a due date, to see the lunar age, lunar month and chart lookup behind a traditional guess.

The chart is folklore for entertainment. It is not a medical prediction and has not been shown to perform better than chance.

## Explore the website

- [Chinese gender predictor and printable chart](https://chinesegenderpredictor.net/)
- [Lunar age calculator](https://chinesegenderpredictor.net/lunar-age-calculator/)
- [Chinese gender calendar 2026](https://chinesegenderpredictor.net/chinese-gender-calendar-2026/)
- [Chinese gender calendar 2027](https://chinesegenderpredictor.net/chinese-gender-calendar-2027/)
- [Free printable gender reveal games](https://chinesegenderpredictor.net/gender-reveal-games/)
- [Old wives' tales and printable guessing game](https://chinesegenderpredictor.net/old-wives-tales-gender-prediction/)
- [Calculation method and chart source](https://chinesegenderpredictor.net/how-it-works/)
- [Research on prediction accuracy](https://chinesegenderpredictor.net/accuracy/)

## Features

- Automatic Gregorian-to-lunar conversion with a disclosed leap-month convention.
- Conception-date and estimated due-date modes.
- An accessible chart, selected-cell highlighting and print styles.
- Lunar age and completed Gregorian age shown together for the same date, with worked Lunar New Year examples.
- Complete 2026 and 2027 calendar PDFs in A4 and US Letter, plus five original printable party games: prediction cards, team vote, name race, eight different Bingo cards and a word scramble with answers.
- Individual game downloads, a nine-page party kit and a blank folklore guessing sheet in both paper sizes. The site includes 18 PDFs with 46 pages in total.
- A sourced old wives' tales guide that separates entertainment from scientific evidence.
- Responsive layouts, a warm light theme, self-hosted fonts and images.
- Date calculations happen in the browser. Input dates are not sent to a server or included in share links.

## Development

Requires Node.js 22.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321/. Run `npm test`, `npm run build` and `npm run check` to validate the project. The site is statically generated with esbuild and lunar-javascript.

## Deployment

Import this repository into Vercel. The checked-in `vercel.json` configures the static build and response headers. Set `SITE_URL=https://chinesegenderpredictor.net` in the Production environment. Preview builds remain noindex.

Cloudflare provides authoritative DNS and proxying for the root domain and www. Full (strict) HTTPS and DNSSEC were verified on October 9, 2026; Spaceship remains the domain registrar. The default `.vercel.app` project domain is removed, and www redirects to the root domain.

The next content revision is implemented and passes the local verified build: 19 tests, 11 pages and 518 internal paths/assets. Its production deployment and browser acceptance are tracked separately in the [QA record](docs/QA.md).

[中文开发与部署说明](docs/DEVELOPMENT.md) · [QA record](docs/QA.md)

## Sources and corrections

The chart version, date-conversion library and research references are documented on the [method page](https://chinesegenderpredictor.net/how-it-works/). Third-party licenses are preserved in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

For reproducible bugs or source corrections, [open a GitHub issue](https://github.com/BogerHou/chinesegenderpredictor/issues). Do not include personal birth dates or pregnancy information in public issues.
