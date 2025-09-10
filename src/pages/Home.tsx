import Dashboard from "../components/Dashboard";
import Search from "../components/Search";

export default function Home() {
  return (
    <div>
      <h1>TechStart</h1>
      <p>Där juniorer blir morgondagens experter!</p>
      <Dashboard />
      <Search />
    </div>
  );
}
