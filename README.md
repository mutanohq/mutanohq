# Mutano

<img src="packages/brand/assets/logo/lockup.svg" alt="Mutano" width="240">

Mutano's headquarters: the brand, website, and shared code behind everything we make.

Mutano is home to games, animation, visual novels, movies, and other fun things, and to the community around them. The name joins _Mugen_ (無限, infinite) and _Tanoshii_ (楽しい, fun).

## Repository

- `apps/website/`: the public website, `@mutano/website`, built with Astro. It also serves the brand kit at `/brand`.
- `packages/brand/`: the brand kit, `@mutano/brand`: logos, icons, color tokens, and fonts.
- `docs/`: the guidelines, specifications, and references the code follows, including the [brand guidelines](docs/guidelines/brand.md).

## Development

```sh
nvm install
pnpm install
pnpm verify
```

`pnpm --filter @mutano/website dev` starts the website locally. `pnpm verify` runs every check CI runs. [Tooling](docs/tooling.md) describes each command.

## Documentation

- [Contributing](CONTRIBUTING.md): setup, branches, commits, validation, pull requests, and releases.
- [Agent instructions](AGENTS.md): how AI agents work in this repository.
- [Documentation](docs/README.md): the guidelines, specifications, and references.
- [Security](SECURITY.md): how to report a vulnerability.

## License

The code is under [Apache-2.0](LICENSE). The Mutano name, logo, and icons are not: the [brand guidelines](docs/guidelines/brand.md#logo) say how to use them. The fonts in `packages/brand/fonts` are under the SIL Open Font License 1.1.
