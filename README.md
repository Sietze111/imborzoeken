# IMBOR Zoeken

**IMBOR Zoeken** is een webapplicatie waarmee gebruikers eenvoudig kunnen zoeken binnen alle termen van **IMBOR 2022**.

De applicatie maakt het mogelijk om snel de juiste classificaties te vinden binnen het IMBOR-datamodel door middel van **fuzzy search** en filtering op verschillende niveaus van de IMBOR-structuur.

## Functionaliteiten

- 🔎 **Fuzzy search**  
  Zoek tolerant op termen, ook wanneer de exacte spelling niet bekend is.

- 🗂 **Zoeken op IMBOR structuur**  
  Gebruikers kunnen zoeken binnen de volgende velden:
  - `beheerlaag`
  - `objecttype`
  - `type`
  - `type_detail`

- ⚡ **Snelle resultaten**  
  De zoekfunctionaliteit is geoptimaliseerd om snel relevante resultaten te tonen.

- 📚 **IMBOR 2022 terminologie**  
  Alle termen zijn gebaseerd op de officiële **IMBOR 2022** dataset.

## Voorbeeld

Zoekopdracht:

Resultaat (voorbeeld):

| beheerlaag | objecttype | type | type_detail |
|------------|------------|------|-------------|
| Groen      | Boom       | Loofboom | Laanboom |
| Groen      | Boom       | Naaldboom | Den |

Door fuzzy search kunnen ook varianten zoals:
bom
booom
lanboom
nog steeds correcte resultaten opleveren.

## Gebruik

1. Voer een zoekterm in.  
2. De applicatie doorzoekt alle IMBOR velden.  
3. Resultaten worden realtime weergegeven.

## Doel van de applicatie

IMBOR bevat een grote hoeveelheid gestandaardiseerde termen.  
Deze applicatie helpt ontwikkelaars, beheerders en dataspecialisten om:

- snel de juiste IMBOR-classificatie te vinden  
- het datamodel beter te begrijpen  
- consistent gebruik van IMBOR te stimuleren

## Dataset

De gebruikte dataset is gebaseerd op:

**IMBOR 2022 – Informatiemodel Beheer Openbare Ruimte**

Meer informatie: [CROW IMBOR](https://www.crow.nl/imbor)

## Techniek

De applicatie gebruikt:

- **TypeScript / JavaScript**  
- **Fuzzy search algoritme**  
- Web interface voor interactieve zoekresultaten  

## Bijdragen

Pull requests zijn welkom.  
Voor grotere wijzigingen kun je eerst een issue openen om te bespreken wat je wilt aanpassen.

## Licentie

MIT
