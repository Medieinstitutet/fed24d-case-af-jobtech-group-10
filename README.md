[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6VsM7MHT)

# Projektbeskrivning

Detta projekt har utvecklats som en del av en kursuppgift i React. Uppgiften gick ut på att använda Arbetsförmedlingens designsystem tillsammans med deras öppna API. Bakgrunden är att Arbetsförmedlingen idag arbetar med att förbättra användarvänligheten i Platsbanken – och här kommer vårt projekt in i bilden.

Syftet är att skapa en webbapplikation där användare kan söka, filtrera och visualisera platsannonser baserade på Arbetsförmedlingens öppna data. Vi har valt att nischa Platsbanken mot juniora techjobb, för att underlätta för studerande och nyutexaminerade inom IT/tech att ta steget ut i arbetslivet.

👉 Testa applikationen här: https://fed24d-case-af-jobtech-group-10.vercel.app/

## Funktionalitet
- Sök bland juniora techjobb via Arbetsförmedlingens öppna API.  
- Filtrera annonser utifrån olika kriterier.  
- Visualisering av data i form av Dashboards.  
- Responsiv design med Arbetsförmedlingens designsystem som grund. 

## Deltagare
| [![Angelica Nylander](https://github.com/angien90.png?size=80)](https://github.com/angien90) | [![Vy Petersson](https://github.com/tgvie.png?size=80)](https://github.com/tgvie) | [![David Brunni](https://github.com/DavidBrunni.png?size=80)](https://github.com/DavidBrunni) |
|:---:|:---:|:---:|
| [Angelica Nylander](https://github.com/angien90) | [Vy Petersson](https://github.com/tgvie) | [David Brunni](https://github.com/DavidBrunni) |

## Teknologier
- HTML, SCSS, Javascript/Typescript
- React
- Axios för API-anrop
- Context API för state-hantering

## Demo
![Startsida](./public/screenshot-home.png)
![Sökresultat](./public/screenshot-search.png)

## Installation

1. Klona repot:
git clone https://github.com/Medieinstitutet/fed24d-case-af-jobtech-group-10.git

2. Installera beroenden:
npm install

3. Starta utvecklingsservern:
npm run dev


---
---


# Uppgiftsbeskrivning
### Skapa en egen Platsbanken för ert drömscenario

Dokumentation om Arbetsförmedlingens öppna data finns på https://jobtechdev.se. All öppna data från arbetsförmedlingen och andra offentliga organisationen går även att hitta direkt på dataportal.se.
I detta dokument ges två förslag på användningsfall som vi tror är lämpliga för studenter som vill utveckla en applikation på riktig data. All data som är öppna data får vem som helst använda utan att fråga myndigheten om lov, så ingen är begränsad till de exempel vi ger.

Läs först igenom kom-igång hjälpen

- [Övergripande dokumentation API:etJobSearch](https://jobtechdev.se/sv/components/jobsearch)
- [Kom-igång guide](https://gitlab.com/arbetsformedlingen/education/education-api/-/blob/main/GETTING_STARTED.md)

## Prova att utforska datan med vår interaktiva tjänst

Görs genom att öppna Swagger-sidan för API:et (för att enkelt testa olika endpoints i API:et och läsa dokumentation för respektive endpoint): Search job ads (jobtechdev.se)

## Uppgift

Använd endpoint https://jobsearch.api.jobtechdev.se/ för att använda/söka bland befintliga annonser.
Det går även bra att använda historiska annonser om ni vill jämföra aktuella annonser med hur det har sett ut tidigare. Detta api finns här: Historical job ads (jobtechdev.se)

Om möjligt, använd en grafisk presentation av era resultat genom t.ex. stapeldiagram eller linjegrafer.

**Observera**
Er slutprodukt ska ej innehålla Arbetsförmedlingens logga eller färger. Anpassa gärna efter eget tycke och smak så att ni har en färgpalett och en god tanke bakom.

## Betygskriterier

### Need-to-have (G)

- Ni har hämtat data på ett strukturerat sätt med hjälp av antingen fetch eller axios.
- Ni har skapat en tjänst som ni använder för att hämta data.
- Ni använder react-koncept vi har pratat om för att göra datan tillgänglig (context, state, routing et.c.).
- Ni använder den syntax, namngivningsstandard samt skrivsätt som vi har lärt er.
- Ni använder designsystemet för presentation.

### Nice-to-have (Extra bonus)

- Styled components (som drar nytta av designsystemet)
- Grafisk presentation av datat
- Användning av custom hook där det finns möjlighet
