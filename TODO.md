# TODO

Use `npm version {patch|minor|major}`!



## Patch: JSdoc

* Dokumentálni kéne a metódusokat, paramétereik és visszatérési értékeik típusát - segíti a fejlesztést
* Magyarul?!



## Major: rebuild & progress

* Újraépíteni az egész kódot:
* Kód + JSdoc nyelve angol
* lib.js: Díjnet API, osztály, metódusokkal
	* ez az, ami logol, és kizárólag fájlba (kikapcsolható)
	* a loggert megkapja paraméterben (log és error függvény kell neki - így a console is átadható egy mozdulattal)
	* később: biztosítani a megfelelő állapotot
		* pl. "fetchInvoiceList" ellenőrzi, h be vagyunk-e jelentkezve és auto. bejelentkezik, etc.
		* meg a "fetchInvoiceFiles(id)" 2 requestet küld, számla oldala, aztán Letöltés lap
* bot.js: Díjnet Bot, osztály, metódusokkal, API-t hívja
	* ez pedig nem logol, de progresst mutat a képernyőn (ld. lejjebb)
* conf.js: betölti a konfigot
* index.js: instance check, aztán new DijnetBot(conf).start()
* Progressz kijelzés: új feature, kikapcsolható
	* a képernyőre, ha van (process.stdout.isTTY)
	* többsoros, visszatörléssel (npm i ansi)
		* kék: Művelet
		* zöld: Számla (ha nem ilyen jellegű a művelet, akkor "-")
		* fehér: Hátralevő idő
	* akár mehet bele valami logó is bal oldalra
		```
		DíjnetBot   | Művelet:        valami
		by  juzraai | Számla:         [x/y] éééé.hh.nn. szolgáltató - szolgáltatás
		vx.x.x      | Hátralevő idő:  x perc
		```
	* és lehet optimalizálni, hogy nem az egész sort írja újra, hanem csak a ":" utáni részt
* +CLI (ld. lent)
* +cache (ld. lent)




## Major/minor: Config via CLI

* A global install kényelmét veszti a .env-es megoldással - parancssori argumentumok segíthetnek.
* https://www.npmjs.com/package/commander

### Major:

* .env-et és konfigfájlt felejtjük
* vannak default értékek
* parancssori argumentumokkal felülírhatóak
* auth infók:
	* A) parancssori arg (`-u` és `-p`)
	* B) vagy ha az nincs, akkor stdin, 2 sor - és ugye itt akkor igény szerint fájlt is megadhatnak (`<`)

### Minor:

* Megtarthatunk konfigfájlt is, csak legyen konfigolható, hogy hol van.
* Szóval a sorrend:
	* default értékek
	* default helyen levő konfigfájlban levő értékek `~/.dijnet-bot` (.env syntax)
	* `-c <fájl>` paraméterben megadott konfigfájl értékei
	* paraméterben megadott értékek
* Paraméterek:
	* `-a <auth file>` - hogy ne kerüljön command historyba érzékeny adat; default: `~/.dijnet-bot`
	* `-L <log level>` - default: 2
	* `-o <output dir>` - default: `./szamlak`
	* `-s <sleep sec>` - default: 3
	* `-t <temp dir>`



## Minor: cache

* Ötlet: a már bejárt számlákat ne nyissuk meg újra
* Meg kell jelölni a számla mappájában, ha "complete" a mentés - vagy akár fordítva, pl. ".incomplete" fájllal, amit mkdirp után hozunk létre és az utolsó fájl sikeres letöltése után törlünk
* Kérdés: egy számlához (row) tartozó fájlok módosulhatnak-e később?
* Ha nem, akkor a fenti megoldás tökéletes
* Ha igen, akkor mondjuk az utolsó 3 hónap számláinál nem vesszük figyelembe a complete/incomplete jelzést és bejárjuk a számlákat (újra)



## Minor: report

CLI:
* `-r` jelenlétében szamla_search_submit után lefut a riport generálás
* `-s` jelenlétében ezután elindul a számlák letöltése
* ha egyik kapcsoló sincs, helpet jelenít meg

Konfig:
* `REPORT_FILE`: fájlnév, vagy ha nincs megadva, akkor stdout

Riport:
* átlagos havi költség
	* szolgáltatásonként az utolsó N hónap átlaga
	* eredmény a fenti értékek szummája
* optimális fizetési nap/időszak meghatározása (mert egyetlen utalás egyszerűbb/kedvezőbb)
	* szolgáltatásonként a számlák kelte és határideje meghatároz egy halmazt - a dátum DD értékeivel
	* vegyük az utolsó N hónap átlagos halmazait
	* feladat: minden szolgáltatáshoz 1 napot (vagy kisebb halmazt?) rendelni a saját halmazából úgy, hogy az összes szolgáltatást tekintve minél kevesebb különböző nap legyen a listában
	* gondolat az induláshoz: egyeztetni a számla kelte dátumokat a legkésőbbihez, majd egyeztetni a határidőket a legkorábbihoz