import Dashboard from "../components/Dashboard";
import Search from "../components/Search";
import logo from "../assets/techstart_logo_with_dark_text.png";

export default function Home() {
  return (
    <>
      <img src={logo} alt="TechStart logga" width="200" className="logo"/>
      <p className="slogan">Där juniorer blir morgondagens experter!</p>
      <Dashboard />
      <Search />
    </>
  );
}
