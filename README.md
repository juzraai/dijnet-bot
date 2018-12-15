# Díjnet Bot

Automatikusan lementi az összes számládat :)

---



## Mi ez?

Ez egy kis programocska, amely **automatikusan le tudja tölteni az összes [Díjnet](https://www.dijnet.hu/)-en levő számládat és azok minden fájlját**, vagyis így meglesz a gépeden minden számla PDF és XML formátumban, illetve a terhelési összesítők is, ahol van ilyen.

Grafikus felülete nincs, ez egy **parancssoros alkalmazás**. A beállításokat és a bejelentkezési adatokat fájlból olvassa, így ideális arra is, hogy **ütemezett feladatként** használd.



## Motiváció

**A Díjnet** az ingyenes szolgáltatása keretében **csak bizonyos ideig őrzi meg** a számlákat. Ha később is el akarjuk érni a fájlokat, akkor vagy [fizetünk a SzámlaPlusz funkcióért](https://www.dijnet.hu/ekonto/docs/hu/szamlaplusz_tajekoztato.pdf) (évi ~1 000 Ft), vagy rendszeresen **lementjük kézzel**. Viszont kézzel lementeni sok számlát az sok munka, ezért **érdemes automatizálni**.

A feladatra már mások is készítettek szkripteket, pl. a [wolandmaster/dijnet-dump](https://github.com/wolandmaster/dijnet-dump) megvalósítás ahogy látom, viszonylag frissen is van tartva. Én ezt nem próbáltam ki, mert kihívást éreztem abban, hogy magam is összerakjak egy ilyen programot nulláról, elsősorban saját célra, saját igények szerint.



## Mi kell hozzá?

* [Node.js](https://nodejs.org/en/) 8.0 vagy újabb



## Hogyan használjam?

1. [Töltsd le a Díjnet Botot](https://github.com/juzraai/dijnet-bot/releases/latest) és csomagold ki
1. Nyiss egy terminált/parancssort ebben a mappában, majd futtasd le az `npm i -g` parancsot, mely letölti a szükséges fájlokat (~ 4 MB) és telepíti a programot a globális NPM csomagok közé
1. Kreálj egy üres mappát valahol, ahol a konfigfájlt és a számlákat fogjuk tárolni
1. Másold bele a letöltött pakkból az `.env.example` fájlt és nevezd át `.env`-re
1. Szerkeszd az `.env` fájlt, ebben lesznek a program beállításai - további instrukciók a fájlban

A fentieket csak egyszer kell megcsinálni, a továbbiakban a programot a `dijnet-bot` paranccsal tudod elindítani. Fontos, hogy ezt abból a könyvtárból tedd meg, ahol a `.env` fájl van.



## Mit is csinál pontosan?

1. Bejelentkezik Díjnet-en (elküldi a login űrlapot)
1. Rámegy a "Számlák keresése" oldalra
1. Elküldi az űrlapot üresen, hogy megkapja az összes számlát
1. Kiparszolja a számlák adatait, majd végigmegy a számlákon:
	1. Megnyitja a számla adatlapját
	1. Rámegy a "Letöltés" fülre
	1. Letölti az összes fájlt, ami be van linkelve
	1. Visszamegy a számla listához

Az eredmény, vagyis **a letöltött fájlok a kimeneti mappába kerülnek** (alapértelmezésként `./szamlak`), szolgáltató, szolgáltatás és dátum bontásban. A könyvtárszerkezet az alábbiak szerint alakul:

```
szamlak/
	szolgáltató neve - szolgáltatási azonosító/
		dátum/
			számla fájljai
```

A szolgáltató neve és a szolgáltatási azonosító normalizálva lesz, a felismerhető ékezetes karakterek át lesznek alakítva ékezet nélkülivé, minden egyéb nem alfanumerikus karakter pedig el lesz távolítva. A számlák egyes fájljai úgy lesznek elnevezve, ahogy a Díjnet szerver generálja.

A program minden alkalommal, **mielőtt kérést küld a Díjnet felé, vár néhány másodpercet.** Az érték állítható, javallott legalább 3-5 másodpercet megadni. Erre azért van szükség, hogy a Díjnet szerverét minél kevésbé terheljük.



## Működik egyáltalán?

Csak egy Díjnet fiókom van, és abban is csak 3 szolgáltató (UPC, FVM és FCSM). A szkriptet **2018. decemberében** végigfuttattam, és az akkor jelen levő ~3.5 tucat számlámat hiánytalanul lementette.

![](https://raw.githubusercontent.com/juzraai/dijnet-bot/master/dijnet-bot-run.png)



## Felhasználási feltételek

A programot az *Unlicense* feltételei alatt osztom meg, vagyis szabadon használhatod - a részletekért kérlek, olvasd át a `LICENSE` fájlt.



## Közreműködés

Ha kérdésed, ötleted van, vagy hibát találtál, nyiss egy ticketet az [*Issues* fülön](https://github.com/juzraai/dijnet-bot/issues). Ha meg netán meg is javítottál valamit, küldj egy pull request-et.
