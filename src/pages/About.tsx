import logo from '../assets/techstart_logo_with_dark_text.png';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';
import person3 from '../assets/person3.png';
import '../styles/about.scss';

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <img src={logo} alt="TechStart logga" className="about-logo" />

        <div className="team">
          <div className="team-member">
            <img src={person1} alt="Person 1" className="team-photo" />
            <p className="team-name">Vy</p>
          </div>

          <div className="team-member">
            <img src={person2} alt="Person 2" className="team-photo" />
            <p className="team-name">David</p>
          </div>

          <div className="team-member">
            <img src={person3} alt="Person 3" className="team-photo" />
            <p className="team-name">Angelica</p>
          </div>
        </div>

        <p>
          Vi vet hur utmanande det kan vara att ta det första steget in i techbranschen. Därför har
          vi skapat en jobbtavla som är helt dedikerad till juniora roller inom IT och teknik.
        </p>

        <p>
          Hos oss kan du enkelt söka, filtrera och hitta de möjligheter som verkligen matchar dina
          färdigheter och ambitioner – oavsett om du letar efter ditt allra första jobb, en
          praktikplats eller ett traineeprogram.
        </p>

        <p>
          Alla jobbannonser på vår plattform hämtas direkt från Arbetsförmedlingens öppna data,
          vilket säkerställer att du alltid har tillgång till uppdaterad och pålitlig information.
        </p>

        <p>
          Vårt mål är att göra jobbsökandet enklare, mer transparent och anpassat för dem som är i
          början av sin karriär. Istället för att scrolla igenom oändliga annonser som kräver års
          erfarenhet, kommer du att upptäcka möjligheter som är designade specifikt för juniora
          talanger.
        </p>
      </div>
    </div>
  );
}

export default About;
