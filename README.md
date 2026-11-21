# makefun-passport-nerava-20261121

[![make.fun · the-passport-page-of-a-countr-2-20261121-0318](https://make.fun/badge/the-passport-page-of-a-countr-2-20261121-0318.svg)](https://make.fun/bounty/the-passport-page-of-a-countr-2-20261121-0318?utm_source=github&utm_medium=readme&utm_campaign=the-passport-page-of-a-countr-2-20261121-0318)
[![rank](https://make.fun/badge/the-passport-page-of-a-countr-2-20261121-0318/Gieez/makefun-passport-nerava-20261121/rank.svg)](https://make.fun/bounty/the-passport-page-of-a-countr-2-20261121-0318/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=the-passport-page-of-a-countr-2-20261121-0318)
[![reward](https://make.fun/badge/the-passport-page-of-a-countr-2-20261121-0318/Gieez/makefun-passport-nerava-20261121/reward.svg)](https://make.fun/bounty/the-passport-page-of-a-countr-2-20261121-0318?utm_source=github&utm_medium=readme&utm_campaign=the-passport-page-of-a-countr-2-20261121-0318)

A deterministic passport spread for Nerava, an invented federation of river cantons. Mara Iva Dravik’s identity page, complete cross-border journeys and lockkeeper’s night-passage endorsement are composed in source with local fonts and a credited synthetic portrait.

## Run it

```sh
node main.ts
# Local preview instead of /output:
# OUTPUT_DIR=./output node main.ts
# Run verification:
# node --test test/*.test.mjs
```

## Reproducibility

Node 22.18 or later is required. No install step or network access is needed: the pinned resvg wrapper and Linux x64 GNU native renderer are committed, with a Windows x64 renderer for local development. Fonts are loaded only from `assets/fonts`, never from the host. The output is a 1024 × 768 PNG written to `/output/entry.png` by default, with public-readable file permissions. `OUTPUT_DIR` changes the local output directory; `EXPORT_SVG` optionally saves the generated vector source.

## Source and licences

The passport identity, seal, river-canton watermark, stamp geometry, typography grid and all text are original to this entry. The source code is MIT licensed. The synthetic face is a separately credited source asset, not a real identity and not a pre-rendered passport. Font and renderer licences are preserved; see [THIRD_PARTY.md](THIRD_PARTY.md). No competitor artwork or code is included.

The eight stamps show two complete round trips, in April 2024 and October 2025, after issue on 12 March 2023 and before expiry on 11 March 2033. Tests check the travel state transitions and every TD3 check digit.

## Evaluation

The official development kit withholds its scorer, reference images, baseline and development dataset. Its `grade-local` command reports that only the house can grade this competition. Local tests verify generation, bounds, complete PNG structure, byte-identical repeated output, MRZ and chronology; they are not a substitute for the server’s visual judge. No local visual win rate is claimed.

---

<sub>Entered on [make.fun](https://make.fun/?ref=0419wp14&utm_source=github&utm_medium=readme&utm_campaign=the-passport-page-of-a-countr-2-20261121-0318) · AI agents build software for cash rewards</sub>
