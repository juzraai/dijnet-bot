# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.12](https://github.com/juzraai/dijnet-bot/compare/v2.1.11...v2.1.12) (2024-04-23)


### Bug Fixes

* bejelentkezés flexibilisebb ellenőrzése ([d8699de](https://github.com/juzraai/dijnet-bot/commit/d8699de49d7c42ce3a7fee8616c04e92f2bcd790))

### [2.1.11](https://github.com/juzraai/dijnet-bot/compare/v2.1.10...v2.1.11) (2024-02-03)


### Bug Fixes

* [#35](https://github.com/juzraai/dijnet-bot/issues/35) -ös hiba javítása backport-olva ([b3ee3ad](https://github.com/juzraai/dijnet-bot/commit/b3ee3adaa5725b4e98f8c5c8f043a2bb2d5ddfef))

### [2.1.10](https://github.com/juzraai/dijnet-bot/compare/v2.1.9...v2.1.10) (2024-01-07)


### Bug Fixes

* DNS gyorsítótár beépítve (remélhetőleg javítja [#34](https://github.com/juzraai/dijnet-bot/issues/34)-et) ([fe0391e](https://github.com/juzraai/dijnet-bot/commit/fe0391ec4a4d69fe3bf634bc49daef072d244fde))
* sleep paraméter kezelés refaktorálva, doksi kiegészítve ([39a326a](https://github.com/juzraai/dijnet-bot/commit/39a326af0fee153470955a8f917eff329ee7aff7))

### [2.1.9](https://github.com/juzraai/dijnet-bot/compare/v2.1.8...v2.1.9) (2023-10-02)


### Bug Fixes

* számla lista parszolási hiba javítva ([0965959](https://github.com/juzraai/dijnet-bot/commit/09659593b1c366c6d077953e1a4e698ff99aef18))

### [2.1.8](https://github.com/juzraai/dijnet-bot/compare/v2.1.7...v2.1.8) (2022-12-09)


### Bug Fixes

* számla adatlap és letöltési link parszolási hiba javítva ([52512fc](https://github.com/juzraai/dijnet-bot/commit/52512fc3b6a63c8b15cf692bee59c2ba49b3c5b6))
* számla lista parszolási hiba javítva ([fdab220](https://github.com/juzraai/dijnet-bot/commit/fdab2206773c1406711a2fb002c7e31489a9fb3d))

### [2.1.7](https://github.com/juzraai/dijnet-bot/compare/v2.1.6...v2.1.7) (2020-10-31)


### Bug Fixes

* részletes naplóban számla dbszám ([65aa9a4](https://github.com/juzraai/dijnet-bot/commit/65aa9a43b34cd394cea2e7e4f908ea5858d0d517)), closes [#14](https://github.com/juzraai/dijnet-bot/issues/14)

### [2.1.6](https://github.com/juzraai/dijnet-bot/compare/v2.1.5...v2.1.6) (2020-06-01)


### Bug Fixes

* nem elérhető fájlok kezelése (átugrás, hibajelzés) ([00ec4af](https://github.com/juzraai/dijnet-bot/commit/00ec4afc2a7c0707a8729ca88d2c7426521a7627)), closes [#8](https://github.com/juzraai/dijnet-bot/issues/8)

### [2.1.5](https://github.com/juzraai/dijnet-bot/compare/v2.1.4...v2.1.5) (2020-05-12)


### Bug Fixes

* aktualizálás az új számla lista HTML-hez ([f17e2a2](https://github.com/juzraai/dijnet-bot/commit/f17e2a21439ad0f4379c26a89aed69c40ff4e887)), closes [#7](https://github.com/juzraai/dijnet-bot/issues/7)

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
