# npmsh

**Shell for running npm cmds and scripts.**

## Installation

```sh
npm i -g npmsh
```

## Quickstart

**Built-in cmds:**

```sh
λ start
# => npm start
```

**Aliases:**

```sh
λ i
# => npm i
```

**`package.json` scripts:**

```sh
λ lint
# => npm run lint
```

**Chaining:**

```sh
λ build && test
# => npm run build && npm test
```

**Flags:**

```sh
λ serve --open
# => npm run serve -- --open
```

**Also has tab completion!**

## License

[WTFPL](http://www.wtfpl.net/) – Do What the F*ck You Want to Public License.

Made with :heart: by [@MarkTiedemann](https://twitter.com/MarkTiedemannDE).