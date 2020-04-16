# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.4](https://github.com/juzraai/dijnet-bot/compare/v2.1.3...v2.1.4) (2020-04-16)


### Bug Fixes

* bundle szkript javítás ([91f7405](https://github.com/juzraai/dijnet-bot/commit/91f740554db21525cd04fbbdd1deeffc1dd19bbe))
* latest release link javítva a README-ben ([598d99e](https://github.com/juzraai/dijnet-bot/commit/598d99e982c4351b1b4cad541326ad470ee35fbd))
* login check-nél kisbetűsen keressük a felhasználónevet ([a3ab09e](https://github.com/juzraai/dijnet-bot/commit/a3ab09e74507c15336c4deebece3c0415afb7e9c)), closes [#6](https://github.com/juzraai/dijnet-bot/issues/6)

### [2.1.3](https://github.com/juzraai/dijnet-bot/compare/v2.1.2...v2.1.3) (2020-03-29)


### Bug Fixes

* többsoros számla azonosítókkal **most már tényleg** nem lesz gond inkrementális letöltésnél ([b23e6ce](https://github.com/juzraai/dijnet-bot/commit/b23e6ce2523594729cab5bd0b05e9d3e722467d6)), closes [#3](https://github.com/juzraai/dijnet-bot/issues/3)

### [2.1.2](https://github.com/juzraai/dijnet-bot/compare/v2.1.1...v2.1.2) (2020-03-22)

### [2.1.1](https://github.com/juzraai/dijnet-bot/compare/v2.1.0...v2.1.1) (2020-03-10)


### Bug Fixes

* többsoros számla azonosítókkal már nem lesz gond inkrementális letöltésnél ([36d5ac2](https://github.com/juzraai/dijnet-bot/commit/36d5ac2580ac8321b247de0f27f34b2b769982c5)), closes [#3](https://github.com/juzraai/dijnet-bot/issues/3)

## [2.1.0](https://github.com/juzraai/dijnet-bot/compare/v2.0.0...v2.1.0) (2019-10-30)


### Features

* app tömörítése 1 fájlba, így nem kell `npm`-et futtatni ([3d3838c](https://github.com/juzraai/dijnet-bot/commit/3d3838c))
* GitHub Release automatizált létrehozása ([ce66296](https://github.com/juzraai/dijnet-bot/commit/ce66296))

## [2.0.0](https://github.com/juzraai/dijnet-bot/compare/v1.4.0...v2.0.0) (2019-10-23)


### ⚠ BREAKING CHANGES

* Az ő/ű betűt tartalmazó számlakibocsátói azonosítók vagy szolgáltatók mappaneve változhat: új mappák jönnek létre, de nem lesz redundáns letöltés. A régi fájlokat kézzel kell átmozgatni az új mappába.
* lib.js szétdarabolva osztályokra, process.env helyett Config modellt használunk már, új logger.js - részletek: ld. JSDoc

* újraírtam az egész cuccot ([6c95ad1](https://github.com/juzraai/dijnet-bot/commit/6c95ad1))


### Bug Fixes

* HTML encoding hiba, most már az ő/ű betűket is korrekten o/u-ra normalizálja ([58a2c0a](https://github.com/juzraai/dijnet-bot/commit/58a2c0a))


### Features

* átláthatóbb folyamatjelzés, a sorok felülírásával a terminálban ([d398d67](https://github.com/juzraai/dijnet-bot/commit/d398d67))
* Díjnet bejelentkezési adatokat most már be tudja kérni prompttal is ([0a711d8](https://github.com/juzraai/dijnet-bot/commit/0a711d8))
* színes DíjnetBot felirat és GitHub URL a logban ([10b4daf](https://github.com/juzraai/dijnet-bot/commit/10b4daf))

## [1.4.0](https://github.com/juzraai/dijnet-bot/compare/v1.3.0...v1.4.0) (2019-10-18)


### Features

* hibakezelés javított kommunikációval ([99dbdeb](https://github.com/juzraai/dijnet-bot/commit/99dbdeb))
* log szintek és szövegek újragondolva (informatívabb logolás) ([8dbb964](https://github.com/juzraai/dijnet-bot/commit/8dbb964))
* program verzió kiírása induláskor ([15acdf3](https://github.com/juzraai/dijnet-bot/commit/15acdf3))

## [1.3.0](https://github.com/juzraai/dijnet-bot/compare/v1.2.0...v1.3.0) (2019-10-11)


### Features

* már lementett számlák átugrása az elején (érthetőbb folyamatjelző) ([317e6ef](https://github.com/juzraai/dijnet-bot/commit/317e6ef))
* parancssori argumentumok kezelése ([f03ed54](https://github.com/juzraai/dijnet-bot/commit/f03ed54))
* számla alapadatok kiírása (informatívabb logolás) ([75c2a45](https://github.com/juzraai/dijnet-bot/commit/75c2a45))

## [1.2.0](https://github.com/juzraai/dijnet-bot/compare/v1.1.2...v1.2.0) (2019-10-02)


### Bug Fixes

* typo javítva a "Várunk X másodpercet" log üzenetben ([0adac51](https://github.com/juzraai/dijnet-bot/commit/0adac51))


### Features

* már lementett számlák nyilvántartása, átugrása ([337cb4e](https://github.com/juzraai/dijnet-bot/commit/337cb4e))
* új fejlesztési workflow, mostantól generálunk changelog-ot ([c791bbd](https://github.com/juzraai/dijnet-bot/commit/c791bbd))
