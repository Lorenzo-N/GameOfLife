# GameOfLife

L'applicazione realizzata è disponibile online all'indirizzo [GameOfLife](https://lorenzonuti.altervista.org/GameOfLife/).

## Esecuzione
L'applicazione è stata sviluppata con [Angular](https://angular.io/) e richiede dunque [Node js](https://nodejs.org/en/)
e [npm](https://www.npmjs.com/) per essere eseguita in locale.

Per lanciare l'applicazione è necessario installare tutte le dipendenze con `npm install` e successivamente
lanciare il comando `ng serve` per avviare l'applicazione all'indirizzo `http://localhost:4200/`.

## Funzionalità
L'interfaccia permette di modificare lo stato della griglia e di eseguire l'aggiornamento di un singolo step oppure un'animazione 
automatica attraverso i controlli in basso.

Nella parte a sinistra è possibile modificare alcune **impostazioni grafiche** oltre alla velocità di avanzamento dell'animazione,
ed è possibile **salvare e caricare lo stato del gioco**, oppure caricare uno dei **preset** disponibili (extra "Loading of initial state").

Infine in alto a sinistra si può scegliere la modalità del cursore che può essere:
* _toggle_: cliccando su una cella si può riempire/svuotare la cella.
* _dettagli_: spostando il cursore su una cella se ne **visualizza la storia** (extra "Cell history"), ovvero lo stato e il numero di turni da cui 
  è in vita o meno.
* _penna_: permette di riempire le celle in modo rapido anche trascinando il cursore.
* _gomma_: permette di svuotare le celle in modo rapido anche trascinando il cursore.

## Struttura del codice
Il codice si basa sul pattern **Model View Controller** applicato su due livelli: il primo è quello su cui si basa Angular, 
organizzato in componenti in cui si distinguono le *viste*, ovvero i componenti html, dai *modelli*, cioè le classi che 
mantengono i dati, attraverso i
*controller* che corrispondono al codice typescript che ne gestisce il funzionamento.

Questo primo MVC è stato applicato ad esempio ai settings, dove l'html che definisce l'interfaccia 
è collegato tramite gli eventi al settings component che va a modificare la classe `Settings` che mantiene i dati.

Il secondo pattern MVC è quello relativo al gioco ed è stato implementato da zero poiché Angular non prevede un'astrazione
equivalente per modificare un canvas. Quindi in questo caso è stata definita la classe `GameView`, che gestisce a sua volta i 3 layer
che si occupano di disegnare i vari strati del canvas. Questa vista ha un riferimento in sola lettura al modello, la classe `Game`,
e si aggancia all'evento update del model per aggiornare di conseguenza l'interfaccia. Inoltre la vista emette anche gli eventi di 
click su una cella, che vengono usati dai controller per aggiornare il modello. Infine il modello definisce i metodi per gestire 
la logica del gioco e per modificare lo stato, che vengono richiamati dai controller e emettono l'evento update, causando 
l'aggiornamento dell'iterfaccia.
