# <div align="center"><img src="img/header.svg" width="400" title="Díjnet Bot" alt="Díjnet Bot - Az összes számlád még egy helyen"></div>



A **Díjnet Bot** lementi az **összes [Díjnet](https://www.dijnet.hu/)-en tárolt számládat,** így azok immáron még egy helyen, *Nálad is* meglesznek.



## Funkciók

- **Mindent visz:** az összes számla összes letölthető fájlját lementi (számla PDF, számla XML, terhelési összesítő, ...).
- **Nem gatyázik:** ha valamit már letöltött, legközelebb átugorja, vagyis mindig csak az új számláidat fogja lementeni.
- **Ért a szóból:** többféle módon beállítható, akár környezeti változókkal, akár konfigurációs fájllal, de még parancssori argumentumokkal is.
- **Tettre kész:** a parancssoros interfész és az inkrementális letöltési funkció miatt ideális arra, hogy ütemezett feladatként használd.
- **Rendszerető:** a letöltött fájlokat mappákba rendezi, szolgáltató, szolgáltatás és dátum szerint.
- **Kíméletes:** a lapok és fájlok letöltése között másodperceket vár, hogy a **Díjnet** szerverét ne terhelje túl.



## Használata

1. Telepíts [Node.js](https://nodejs.org/en/)-t, legalább a 8.0-ás verziót
1. [Töltsd le a Díjnet Botot](https://github.com/juzraai/dijnet-bot/releases/latest) és csomagold ki
1. Nyiss egy terminált/parancssort ebben a mappában, majd futtasd le az `npm i -g` parancsot, mely letölti a szükséges fájlokat (~ 12 MB) és telepíti a programot a globális NPM csomagok közé
1. Kreálj egy üres mappát valahol, ahol a számlákat fogjuk tárolni
1. (opcionális) Lehetőség van a program beállításait rögzíteni, 2 módon is:
	1. Az egyik mód az, hogy abban a könyvtárban, ahonnan a programot indítod, kreálsz egy `.env` fájlt, amit a `.env.example` fájl másolásával és átnevezésével teszel meg. A fájlban további instrukciókat találsz a beállítások szerkesztéséhez.
	1. A másik mód az, hogy környezeti változókat állítasz be a rendszereden. A környezeti változók nevei és lehetséges értékei szintén a `.env.example` fájlban vannak leírva.
1. A program a `dijnet-bot` paranccsal indítható, melynek a beállítások megadhatók parancssori argumentumokként is. Ezek felülbírálják a környezeti változókat és a `.env` fájlban rögzített beállításokat. A parancssori argumentumok bemutatásához futtasd a programot a `-h` kapcsolóval:

```
$ dijnet-bot -h
```

Példa a futtatásra (számlák letöltésének indítása, alapértelmezett beállításokkal):

```
$ dijnet-bot -u felhasználónév -p jelszó
```



## Működése

1. Bejelentkezik **Díjnet**-en (elküldi a login űrlapot)
1. Rámegy a "Számlák keresése" oldalra
1. Elküldi az űrlapot üresen, hogy megkapja az összes számlát
1. Kiolvassa a számlák adatait, majd végigmegy a számlákon:
	1. Ha ennek a számlának a fájljait még nem töltötte le, akkor:
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

A szolgáltató neve és a szolgáltatási azonosító normalizálva lesz, a felismerhető ékezetes karakterek át lesznek alakítva ékezet nélkülivé, minden egyéb nem alfanumerikus karakter pedig el lesz távolítva. A számlák egyes fájljai úgy lesznek elnevezve, ahogy a **Díjnet** szerver generálja.

A program minden alkalommal, **mielőtt kérést küld a Díjnet felé, vár néhány másodpercet.** Az érték állítható, javallott legalább 3-5 másodpercet megadni. Erre azért van szükség, hogy a **Díjnet** szerverét minél kevésbé terheljük.

A program a kimeneti mappán belül a `kesz.txt` fájlba beírja azon számlák azonosítóját (számlaszám/bizonylatszám), amelyeknek minden fájlját sikerült lementeni. Így a következő futtatásakor ezeket a számlákat át tudja ugrani, vagyis **csak az újabb (vagy korábban nem lementett) számlákkal fog foglalkozni.**



## Motiváció

A **Díjnet** az ingyenes szolgáltatása keretében **csak bizonyos ideig őrzi meg** a számlákat. Ha később is el akarjuk érni a fájlokat, akkor

- vagy [fizetünk a **SzámlaPlusz** funkcióért](https://www.dijnet.hu/ekonto/docs/hu/szamlaplusz_tajekoztato.pdf) (évi ~1 000 Ft),
- vagy rendszeresen **lementjük kézzel**, ami fáradtságos munka lehet.

A **Díjnet Bot** az utóbbi megoldás **automatizálására szolgál**, vagyis gyakorlatilag helyettünk kattintgat végig a számlákon és a **Díjnet** által biztosított letöltési linkeken.

A fenti két út természetesen nem zárja ki egymást, a **SzámlaPlusz funkcióra érdemes előfizetni** még a **Díjnet Bot** használata mellett is, mert minél több helyen vannak meg a fontos fájljaink, annál jobb.

Az automatizálási feladatra már mások is készítettek szkripteket (pl. [wolandmaster/dijnet-dump](https://github.com/wolandmaster/dijnet-dump)). Én ezeket nem próbáltam ki, mert kihívást éreztem abban, hogy magam is összerakjak egy ilyen programot nulláról, elsősorban saját célra, saját igények szerint.



## Licensz

[MIT](LICENSE)



## Közreműködés

Ha kérdésed, ötleted van, vagy hibát találtál, kérlek nyiss egy új ticketet az [*Issues* fülön](https://github.com/juzraai/dijnet-bot/issues). Ha netán meg is javítottál valamit, lécci küldj egy pull request-et.
