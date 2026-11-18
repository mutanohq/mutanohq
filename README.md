# Mutano

<img src="assets/logo/logo-dark.svg" alt="Mutano" width="240">

Mutano's headquarters: the brand, website, and shared code behind everything we make.

Mutano is home to games, animation, visual novels, movies, and other fun things, and to the community around them. The name joins _Mugen_ (無限, infinite) and _Tanoshii_ (楽しい, fun).

## Repository

- `apps/www/`: the public website, `@mutano/www`, built with Astro. It also publishes the brand files at `/brand`.
- `assets/`: the brand files: logos, icons, social images, the color palette, and fonts. [Assets](docs/assets.md) lists them.
- `scripts/`: the repository's own scripts, including `pnpm assets`, which generates the logos and icons.
- `docs/`: the guidelines, specifications, and references the code follows, including the [brand guidelines](docs/guidelines/brand.md).

## Development

```sh
nvm install
pnpm install
pnpm verify
```

`pnpm --filter @mutano/www dev` starts the website locally. `pnpm verify` runs every check CI runs. [Tooling](docs/tooling.md) describes each command.

## Documentation

- [Contributing](CONTRIBUTING.md): setup, branches, commits, validation, pull requests, and releases.
- [Agent instructions](AGENTS.md): how AI agents work in this repository.
- [Documentation](docs/README.md): the guidelines, specifications, and references.
- [Security](SECURITY.md): how to report a vulnerability.

## License

The code is under [Apache-2.0](LICENSE). The Mutano name, logo, and icons are not: the [brand guidelines](docs/guidelines/brand.md#logo) say how to use them. The fonts in `assets/fonts` are under the SIL Open Font License 1.1.
