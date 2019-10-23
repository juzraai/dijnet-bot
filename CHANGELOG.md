# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
