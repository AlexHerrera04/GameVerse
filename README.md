# GameVerse

## Motiu del projecte

La idea principal era fer una app que motivés a l'usuari a jugar a tennis i entrenar-lo, no obstant, les coses es van complicar en el moment en el que vaig haver de crear les meves pròpies APIs i el resultat del projecte va ser molt pobre, llavors vaig decidir crear-ne un de nou aprofitant la meva passió pels videojocs. Sempre he sigut fanàtic d'una web anomenada 'letterbox' on amants del cinema penjen les seves reviews i opinions sobre les pel.lícules que veuen i les comparteixen amb els demés usuaris de la web, per això he volgut fer algo semblant pero enfocat als videojocs, el resultat és aquest: GameVerse

## Descripció general

GameVerse és una aplicació web fullstack centrada en el món dels videojocs. El projecte permet buscar jocs, consultar-ne la informació principal, veure captures i detalls, guardar títols a favorits, puntuar-los, escriure reviews i consultar perfils públics d’altres usuaris.

La idea principal del projecte és oferir una experiència completa al voltant dels videojocs en una sola plataforma. No és només un cercador de jocs, sinó també un espai on cada usuari pot construir la seva pròpia col·lecció personal, deixar la seva opinió i compartir-la amb altres persones.

## Objectiu del projecte

L’objectiu de GameVerse és combinar diverses funcionalitats habituals dins d’una aplicació moderna en un únic producte coherent. El projecte treballa tant la part de client com la part de servidor i inclou autenticació, gestió de dades pròpies, crides a una API externa i una base de dades local per guardar la informació generada pels usuaris.

També serveix com a exemple pràctic d’una arquitectura separada entre frontend i backend, amb una SPA al client i una API REST al servidor.

## Funcionalitats principals

- Cerca de videojocs per nom.
- Filtrat de jocs per plataformes i gèneres.
- Ordenació dels resultats segons diferents criteris.
- Consulta de fitxes detallades de cada joc.
- Visualització de captures i informació ampliada.
- Registre i inici de sessió d’usuaris.
- Sistema de favorits personal.
- Puntuació de favorits amb escala de 1 a 5.
- Sistema de reviews amb títol, contingut i puntuació.
- Possibilitat de donar like a les reviews.
- Perfil públic per a cada usuari amb les seves reviews i favorits.
- Llistat de pròxims llançaments.
- Llistat de reviews de la comunitat.

## Arquitectura del projecte

GameVerse està dividit en dues parts principals.

El frontend està desenvolupat amb React i funciona com una Single Page Application. Aquesta part s’encarrega de la navegació, la interfície, la gestió d’estat al client i les crides al backend.

El backend està desenvolupat amb Node.js i Express. Aquesta part s’encarrega de la lògica de negoci, de la gestió de l’autenticació, de la connexió amb la base de dades SQLite i de la comunicació amb l’API externa de RAWG.

La informació pròpia de l’aplicació, com ara usuaris, favorits, reviews i likes, es desa a SQLite. En canvi, la informació dels videojocs es recupera principalment des de l’API externa de RAWG.

## Estructura del projecte

- `backend/` conté l’API REST feta amb Node.js i Express.
- `backend/config/` conté la configuració de la base de dades.
- `backend/controllers/` conté la lògica dels endpoints.
- `backend/middleware/` conté el middleware d’autenticació amb JWT.
- `backend/routes/` conté la definició de rutes de l’API.
- `backend/server.js` és el punt d’entrada del servidor.
- `frontend/` conté la part client desenvolupada amb React.
- `frontend/public/` conté la base HTML de l’aplicació.
- `frontend/src/assets/` conté els estils globals.
- `frontend/src/components/` conté components reutilitzables.
- `frontend/src/context/` conté els contextos globals de l’aplicació.
- `frontend/src/pages/` conté les pàgines principals.
- `frontend/src/services/` conté la configuració de les crides a l’API.
- `backend/database/` conté el fitxer SQLite generat per l’aplicació.
- `package.json` a l’arrel serveix per gestionar scripts generals del projecte si cal.

## Tecnologies utilitzades

- React 18 per al frontend.
- React Router v6 per a la navegació.
- Axios per a les peticions HTTP.
- CSS personalitzat amb variables per a l’estil visual.
- Node.js com a entorn d’execució del backend.
- Express per construir l’API REST.
- better-sqlite3 per treballar amb SQLite.
- bcryptjs per xifrar contrasenyes.
- jsonwebtoken per gestionar l’autenticació amb JWT.
- SQLite com a base de dades local.
- RAWG Video Games Database API com a font externa d’informació de videojocs.

## Funcionament general de l’aplicació

Quan un usuari entra a GameVerse, pot navegar pel cercador, consultar els jocs disponibles, veure detalls i explorar contingut general encara que no estigui autenticat.

Quan un usuari es registra o inicia sessió, obté accés a funcionalitats personals. A partir d’aquí pot afegir jocs a favorits, puntuar-los, escriure reviews, editar-les o eliminar-les si en és el propietari, i consultar el seu perfil públic.

La informació dels jocs no es guarda directament a la base de dades interna, sinó que es consulta a RAWG. En canvi, la informació generada per l’usuari sí que s’emmagatzema localment a SQLite.

## Base de dades

La base de dades del projecte treballa principalment amb quatre blocs d’informació.

- La taula `users` guarda la informació de cada usuari, com el nom d’usuari, el correu, la contrasenya xifrada, l’avatar, la bio i les dates de creació i actualització.
- La taula `favorites` guarda els jocs marcats com a favorits per cada usuari. També desa informació bàsica del joc perquè es pugui mostrar ràpidament, com el nom, el slug, la imatge, la data de llançament, la puntuació general i la puntuació personal de l’usuari. Aquesta puntuació personal es considera en escala de 1 a 5.
- La taula `reviews` guarda les ressenyes escrites pels usuaris. Cada review inclou el joc relacionat, el títol, el contingut i la puntuació.
- La taula `review_likes` relaciona usuaris i reviews per gestionar els likes sense duplicats.

## Contextos i gestió d’estat al frontend

El frontend utilitza contextos per centralitzar informació important de l’aplicació.

- `AuthContext` gestiona l’usuari autenticat, el login, el registre, el logout i l’actualització del perfil.
- `FavoritesContext` gestiona la llista de favorits, la comprovació de si un joc ja és favorit, l’afegit i l’eliminació de jocs i la puntuació dels favorits.
- `ToastProvider` permet mostrar notificacions temporals a la interfície.

## Endpoints del backend

Els endpoints d’autenticació són els següents.

- `POST /api/auth/register` crea un nou usuari.
- `POST /api/auth/login` inicia sessió i retorna el token JWT.
- `GET /api/auth/me` retorna les dades de l’usuari autenticat.
- `PUT /api/auth/me` actualitza les dades de l’usuari autenticat.
- `GET /api/auth/profile/:username` retorna el perfil públic d’un usuari.

Els endpoints relacionats amb els jocs són els següents.

- `GET /api/platforms` retorna la llista de plataformes.
- `GET /api/genres` retorna la llista de gèneres.
- `GET /api/games` retorna jocs segons cerca, filtres i ordenació.
- `GET /api/games/upcoming` retorna els pròxims llançaments.
- `GET /api/games/:id` retorna el detall complet d’un joc, incloent captures i tràilers si n’hi ha.

Els endpoints relacionats amb favorits són els següents.

- `GET /api/favorites` retorna tots els favorits de l’usuari autenticat.
- `POST /api/favorites` afegeix un joc a favorits.
- `DELETE /api/favorites/:gameId` elimina un joc dels favorits.
- `PATCH /api/favorites/:gameId/rating` assigna o actualitza la puntuació personal del joc a favorits.

Els endpoints relacionats amb reviews són els següents.

- `GET /api/reviews` retorna les reviews de la comunitat de manera paginada.
- `GET /api/reviews/mine` retorna les reviews de l’usuari autenticat.
- `GET /api/reviews/game/:game_id` retorna les reviews d’un joc concret.
- `POST /api/reviews` crea una nova review.
- `PUT /api/reviews/:id` actualitza una review existent si l’usuari n’és el propietari.
- `DELETE /api/reviews/:id` elimina una review si l’usuari n’és el propietari.
- `POST /api/reviews/:id/like` afegeix o elimina un like sobre una review.

## Format orientatiu de dades

Per registrar un usuari, el backend espera un objecte amb nom d’usuari, correu electrònic i contrasenya.

Per afegir un joc a favorits, el backend espera informació bàsica del joc, com el seu identificador, el nom, el slug, la imatge, la puntuació general i la data de llançament.

Per crear una review, el backend espera l’identificador del joc, el nom del joc, el slug, la imatge, el títol de la review, el contingut i la puntuació.

## Propostes de millora

- Migrar de SQLite a PostgreSQL per tenir una base de dades més robusta.
- Afegir recuperació de contrasenya i verificació de correu electrònic.
- Incorporar rols d’usuari i panell d’administració.
- Afegir més filtres de cerca i recomanacions personalitzades.
- Millorar la gestió d’errors i els missatges de feedback al frontend.
- Afegir proves automàtiques al frontend i al backend.
- Implementar paginació més avançada i càrrega incremental en més seccions.
- Permetre editar el perfil amb avatar personalitzat i més dades públiques.
- Afegir llistes personalitzades més enllà dels favorits.
- Preparar el projecte per a desplegament amb una base de dades persistent i variables d’entorn separades per entorn.
