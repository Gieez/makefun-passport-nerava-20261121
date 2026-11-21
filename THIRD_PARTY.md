# Third-party source assets

## Synthetic portrait

`assets/synthetic-portrait.jpg` is **Woman 1.jpg**, uploaded by Owlsmcgee, dated 22 September 2019. The Wikimedia Commons description states that this is a StyleGAN-generated person who does not exist and marks the file public domain as an AI-generated image lacking sufficient human authorship. It is not a photograph of a real passport holder. The generator clips the background, extends a small clipped hair edge from the source texture, applies a restrained print wash, and uses the image as one component of the final composition.

Source description: https://commons.wikimedia.org/wiki/File:Woman_1.jpg

Original file: https://upload.wikimedia.org/wikipedia/commons/1/1f/Woman_1.jpg

The synthetic face is the only downloaded pictorial source used by the entry. No competitor artifact is included. The intended identity, country, document and stamps are fictional.

## Fonts

The bundled PT Serif, Lato and IBM Plex Mono fonts are from the Google Fonts repository, with each family's SIL Open Font License text beside the font files in `assets/fonts`.

- https://github.com/google/fonts/tree/main/ofl/ptserif
- https://github.com/google/fonts/tree/main/ofl/lato
- https://github.com/google/fonts/tree/main/ofl/ibmplexmono

## SVG renderer

`@resvg/resvg-js` 2.6.2 and its Linux x64 GNU and Windows x64 MSVC native packages are vendored under `node_modules/@resvg`. The wrapper's upstream MPL-2.0 LICENSE is preserved, as are package metadata and upstream documentation. These packages were obtained unmodified from npm. Native modules contain the upstream renderer; none contains a pre-rendered passport or a table of contest answers.

- https://www.npmjs.com/package/@resvg/resvg-js/v/2.6.2
- https://github.com/thx/resvg-js

The repository's own source is MIT licensed; third-party materials retain their respective terms.
