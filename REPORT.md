# 📌 Rättningsrapport – fed24d-case-af-jobtech-group-10

## 🎯 Uppgiftens Krav:
# Skapa en egen Platsbanken för ert drömscenario 

Dokumentation om Arbetsförmedlingens öppna data finns på https://jobtechdev.se. All öppna data från arbetsförmedlingen och andra offentliga organisationen går även att hitta direkt på dataportal.se. 
I detta dokument ges två förslag på användningsfall som vi tror är lämpliga för studenter som vill utveckla en applikation på riktig data. All data som är öppna data får vem som helst använda utan att fråga myndigheten om lov, så ingen är begränsad till de exempel vi ger.

Läs först igenom kom-igång hjälpen 

-  [Övergripande dokumentation API:etJobSearch](https://data.arbetsformedlingen.se/data/platsannonser/)
-  [Kom-igång guide](https://gitlab.com/arbetsformedlingen/job-ads/jobsearch/jobsearch-api/-/blob/main/docs/GettingStartedJobSearchSE.md)

## Prova att utforska datan med vår interaktiva tjänst 

Görs genom att öppna Swagger-sidan för API:et (för att enkelt testa olika endpoints i API:et och läsa dokumentation för respektive endpoint): [Search job ads (jobtechdev.se)](https://jobsearch.api.jobtechdev.se/)

## Uppgift 

Använd endpoint **/search** för att söka bland befintliga annonser. 
Det går även bra att använda historiska annonser om ni vill jämföra aktuella annonser med hur det har sett ut tidigare. Detta api finns här: [Historical job ads (jobtechdev.se)](https://historical.api.jobtechdev.se/)

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
- Använd endpoint /complete för att lägga till autocomplete-funktion och få förslag på begrepp vid fritextsökning

## 🔍 ESLint-varningar:
- C:\Work\AssignmentCorrector\backend\repos\fed24d-case-af-jobtech-group-10\src\services\jobService.ts - no-console - Unexpected console statement.

## 🏆 **Betyg: G**
📌 **Motivering:** Uppgiften uppfyller G-kraven: data hämtas strukturerat via axios, anropen är kapslade i tjänster (services), React-koncept som routing, state och separerade komponenter används, och designsystemet från Arbetsförmedlingen används konsekvent. Ni visar även grafisk presentation (stapeldiagram) och en detaljerad jobbsida.

💡 **Förbättringsförslag:**  
- Sökflödet: SearchForm tar emot onSearch som prop men anropar aldrig den. Lägg till onAfOnClick på DigiFormInputSearch-knappen (och Enter-submit) samt trigga handleSearch även när filter väljs (t.ex. direkt i onAfSubmitFilter eller via useEffect beroende av filter/query).
- Prestanda: Ni gör N+1-anrop genom att hämta /ad/:id för varje träff. Använd fältfiltrering i /search (t.ex. fields/include) för att få med de fält ni behöver direkt i träffarna och slippa extra detaljanrop.
- Felhantering: Ni använder try/finally men fångar inte fel. Lägg till catch och visa ett Digi-komponent-baserat felmeddelande (t.ex. DigiInfoCard/DigiAlert) för bättre UX när API:et fallerar.
- Säkerhet: Ni renderar HTML från API:t via dangerouslySetInnerHTML utan sanering. Använd t.ex. DOMPurify innan render.
- Kodstädning: Ta bort kvarlämnade console.log i JobDetail och död kod (services/taxonomyService.ts verkar inte användas). Rensa oanvända props i SearchForm (t.ex. filterCity som inte används i komponenten) eller använd dem.
- Namngivning/prop-konvention: Blanda inte af-variation (kebab-case) och afVariation (camelCase) i samma komponenttyp. Håll enhetlig stil enligt wrapperns typdefinitioner för bättre DX och typkontroll.
- Navigering: DigiInfoCard använder af-link-href (ankarlänk). För interna länkar kan ni med fördel använda React Router <Link> för SPA-navigering utan full sidladdning.
- UX: Visa laddare/fel per sektion i Dashboard (totalt, toppstäder, senaste) så inte hela instrumentpanelen blockerar allt vid partiella fel. Lägg gärna till tomt-tillstånd med tydligare information.
- Konfiguration: Flytta bas-URL:er till miljövariabler (Vite env) och lägg till simpel cache för taxonomi-svar som sällan ändras.
- Nice-to-have: Lägg till /complete för autocomplete i sökfältet samt extrahera söklogik till en custom hook (useJobsSearch) för bättre återanvändning och testbarhet.

## 👥 Gruppbidrag

| Deltagare | Antal commits | Commit % | Uppgiftskomplettering | Totalt bidrag |
| --------- | -------------- | -------- | ---------------------- | ------------- |
| tgvie | 27 | 51.9% | 0.25 | 0.36 |
| angien90 | 11 | 21.2% | 0.25 | 0.23 |
| Angelica Nylander | 10 | 19.2% | 0.25 | 0.23 |
| David Brunni | 4 | 7.7% | 0.25 | 0.18 |


### 📊 Förklaring
- **Antal commits**: Antalet commits som personen har gjort
- **Commit %**: Procentuell andel av totala commits
- **Uppgiftskomplettering**: Poäng baserad på mappning av README-krav mot kodbidrag 
- **Totalt bidrag**: Viktad bedömning av personens totala bidrag (40% commits, 60% uppgiftskomplettering)
