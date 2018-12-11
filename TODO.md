# TODO v1.1.0

## Feature: cache

* Ötlet: a már bejárt számlákat ne nyissuk meg újra
* Meg kell jelölni a számla mappájában, ha "complete" a mentés - vagy akár fordítva, pl. ".incomplete" fájllal, amit mkdirp után hozunk létre és az utolsó fájl sikeres letöltése után törlünk
* Kérdés: egy számlához (row) tartozó fájlok módosulhatnak-e később?
* Ha nem, akkor a fenti megoldás tökéletes
* Ha igen, akkor mondjuk az utolsó 3 hónap számláinál nem vesszük figyelembe a complete/incomplete jelzést és bejárjuk a számlákat (újra)


## Feature: report

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