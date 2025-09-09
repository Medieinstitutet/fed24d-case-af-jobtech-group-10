import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import About from "./pages/About";
import { DigiButton } from '@digi/arbetsformedlingen-react';
import { ButtonVariation } from '@digi/arbetsformedlingen';


function App() {
  return (
		<>
			<DigiButton
				afVariation={ButtonVariation.PRIMARY}>
				Hälsa
			</DigiButton>

			<div>
				<nav style={{ padding: '1rem', background: '#eee' }}>
					<Link to='/'>Home</Link> | <Link to='/search'>Search</Link> | <Link to='/about'>About</Link>
				</nav>

				<Routes>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='/search'
						element={<Search />}
					/>
					<Route
						path='/about'
						element={<About />}
					/>
				</Routes>
			</div>
		</>
	);
}

export default App;