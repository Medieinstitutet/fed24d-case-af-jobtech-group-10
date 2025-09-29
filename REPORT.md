# 📌 Rättningsrapport – fed24d-case-af-jobtech-group-10

## 🎯 Uppgiftens Krav:
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6VsM7MHT)
# Skapa en egen Platsbanken för ert drömscenario 

Dokumentation om Arbetsförmedlingens öppna data finns på https://jobtechdev.se. All öppna data från arbetsförmedlingen och andra offentliga organisationen går även att hitta direkt på dataportal.se. 
I detta dokument ges två förslag på användningsfall som vi tror är lämpliga för studenter som vill utveckla en applikation på riktig data. All data som är öppna data får vem som helst använda utan att fråga myndigheten om lov, så ingen är begränsad till de exempel vi ger.

Läs först igenom kom-igång hjälpen 

-  [Övergripande dokumentation API:etJobSearch](https://jobtechdev.se/sv/components/jobsearch)
-  [Kom-igång guide](https://gitlab.com/arbetsformedlingen/education/education-api/-/blob/main/GETTING_STARTED.md)

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

## 🔍 ESLint-varningar:
- C:\Work\AssignmentCorrector\backend\repos\fed24d-case-af-jobtech-group-10\src\services\jobService.ts - no-console - Unexpected console statement.

## 🏆 **Betyg: G**
📌 **Motivering:** Uppfyller G-kraven: data hämtas strukturerat via axios och tjänstelager (api/taxonomyApi/jobService), React-router och state används, designsystemet från Arbetsförmedlingen används konsekvent med egen färgpalett, samt grafisk presentation (stapeldiagram) finns. Kodbasen är överlag välstrukturerad med TypeScript-modeller.

💡 **Förbättringsförslag:**  
Funktionalitet och UX:
- Koppla ihop Sök-knappen och filtren med sökningen. SearchForm tar emot onSearch men anropas aldrig; anropa handleSearch när användaren klickar Sök eller skickar filter (onAfSubmitFilter), och/eller trigga sökning automatiskt vid ändrade filter/sökterm (med debounce).
- Undvik N+1-anrop i söklistan. Ni hämtar /search och därefter getJobDetails per träff. Använd i stället fälten från /search (eller välj specifika fält via params) för listvyn och hämta detaljer först i JobDetail. Det ger stor prestandavinst.

Kodkvalitet och robusthet:
- Lägg till felhantering i tjänster och UI (try/catch + användarvänliga felmeddelanden/empty states). Ni sätter loading i finally men visar inte fel för användaren.
- Sanera HTML innan dangerouslySetInnerHTML (t.ex. DOMPurify) för att minimera XSS-risk.
- Ta bort console.log i produktionskod och använd centraliserad logging vid behov.
- Flytta baseURL till miljövariabler (Vite env) i stället för hårdkodning.

Designsystem-API och typer:
- Enhetlig props-casing för React-wrappers: använd camelCase (t.ex. afHeading, afHeadingLevel, afVariation) konsekvent. Kebab-case (af-heading) kan ignoreras av wrappern.
- Använd wrapperns eventprops (t.ex. onAfOnClick) i stället för addEventListener på ref där det går. Säkerställ att ref pekar på underliggande web component (forwardRef), annars triggas inte eventlyssnare.

CSS/struktur:
- Undvik globala selektorer som påverkar allt (t.ex. li, ul). Scope:a till komponenter (BEM, CSS Modules) för att minska oönskade bieffekter.
- DRY: ni duplicerar styling för .digi-info-card-content i flera filer. Extrahera till gemensam partial.

Arkitektur/återanvändning:
- Cache:a taxonomilistor (working-hours, occupation-group/-name) så att de inte hämtas om och om igen.
- Skapa en custom hook (t.ex. useJobSearch) för logiken kring sök/pagination/filter – blir renare komponenter och enklare testning.
- Rensa bort oanvända hjälpfunktioner (taxonomy.ts) eller konsolidera mot ett enda taxonomy-lager.

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
