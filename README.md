# Díjnet Bot

Automatikusan lementi az összes számládat :)

---



## Mi ez?

Ez egy kis programocska, amely **automatikusan le tudja tölteni az összes [Díjnet](https://www.dijnet.hu/)-en levő számládat és azok minden fájlját**, vagyis így meglesz a gépeden minden számla PDF és XML formátumban, illetve a terhelési összesítők is, ahol van ilyen.

Grafikus felülete nincs, ez egy **parancssoros alkalmazás**. A beállításokat és a bejelentkezési adatokat környezeti változókból, fájlból, vagy parancssori argumentumokból olvassa, így ideális arra is, hogy **ütemezett feladatként** használd.



## Motiváció

**A Díjnet** az ingyenes szolgáltatása keretében **csak bizonyos ideig őrzi meg** a számlákat. Ha később is el akarjuk érni a fájlokat, akkor vagy [fizetünk a SzámlaPlusz funkcióért](https://www.dijnet.hu/ekonto/docs/hu/szamlaplusz_tajekoztato.pdf) (évi ~1 000 Ft), vagy rendszeresen **lementjük kézzel**. Viszont kézzel lementeni sok számlát az sok munka, ezért **érdemes automatizálni**.

A feladatra már mások is készítettek szkripteket, pl. a [wolandmaster/dijnet-dump](https://github.com/wolandmaster/dijnet-dump) megvalósítás ahogy látom, viszonylag frissen is van tartva. Én ezt nem próbáltam ki, mert kihívást éreztem abban, hogy magam is összerakjak egy ilyen programot nulláról, elsősorban saját célra, saját igények szerint.



## Mi kell hozzá?

* [Node.js](https://nodejs.org/en/) 8.0 vagy újabb



## Hogyan használjam?

1. [Töltsd le a Díjnet Botot](https://github.com/juzraai/dijnet-bot/releases/latest) és csomagold ki
1. Nyiss egy terminált/parancssort ebben a mappában, majd futtasd le az `npm i -g` parancsot, mely letölti a szükséges fájlokat (~ 12 MB) és telepíti a programot a globális NPM csomagok közé
1. Kreálj egy üres mappát valahol, ahol a számlákat fogjuk tárolni
1. (opcionális) Lehetőség van a program beállításait rögzíteni, 2 módon is:
	1. Az egyik mód az, hogy abban a könyvtárban, ahonnan a programot indítod, kreálsz egy `.env` fájlt, amit a `.env.example` fájl másolásával és átnevezésével teszel meg. A fájlban további instrukciókat találsz a beállítások szerkesztéséhez.
	1. A másik mód az, hogy környezeti változókat állítasz be a rendszereden. A környezeti változók nevei és lehetséges értékei szintén a `.env.example` fájlban vannak leírva.
1. A program a `dijnet-bot` paranccsal indítható, melynek a beállítások megadhatóak parancssori argumentumokként is. Ezek felülbírálják a környezeti változókat és a `.env` fájlban rögzített beállításokat. A parancssori argumentumok bemutatásához futtasd a programot a `-h` kapcsolóval:

```
$ dijnet-bot -h
```



## Mit is csinál pontosan?

1. Bejelentkezik Díjnet-en (elküldi a login űrlapot)
1. Rámegy a "Számlák keresése" oldalra
1. Elküldi az űrlapot üresen, hogy megkapja az összes számlát
1. Kiparszolja a számlák adatait, majd végigmegy a számlákon:
	1. Ha ennek a számlának a fájljait még nem töltöttük le, akkor:
		1. Megnyitja a számla adatlapját
		1. Rámegy a "Letöltés" fülre
		1. Letölti az összes fájlt, ami be van linkelve
		1. Megjelöli ezt a számlát, hogy a program későbbi futtatásánál ne töltse le újra
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

A program a kimeneti mappán belül a `kesz.txt` fájlba beírja azon számlák azonosítóját (számlaszám/bizonylatszám), amelyeknek minden fájlját sikerült lementeni. Így a következő futtatásakor ezeket a számlákat át tudja ugorni, vagyis **csak az újabb (vagy korábban nem lementett) számlákkal fog foglalkozni.** (Ha a program korábbi verziójával már töltöttél le számlákat, azokat egyszer újra le fogja tölteni. Vagy akár azt is megteheted, hogy a `kesz.txt`-be soronként beírod a számla azonosítókat.)



## Működik egyáltalán?

Csak egy Díjnet fiókom van, és abban is csak 3 szolgáltató (UPC, FVM és FCSM). A szkriptet **2019. szeptemberében** végigfuttattam, és az akkor jelen levő ~5 tucat számlámat hiánytalanul lementette. (Az alábbi screenshot 2018.-ban készült, amikor még kevesebb számlám volt.)

![](https://raw.githubusercontent.com/juzraai/dijnet-bot/master/dijnet-bot-run.png)



## Felhasználási feltételek

A programot az *Unlicense* feltételei alatt osztom meg, vagyis szabadon használhatod - a részletekért kérlek, olvasd át a `LICENSE` fájlt.



## Közreműködés

Ha kérdésed, ötleted van, vagy hibát találtál, kérlek nyiss egy új ticketet az [*Issues* fülön](https://github.com/juzraai/dijnet-bot/issues). Ha netán meg is javítottál valamit, lécci küldj egy pull request-et.
