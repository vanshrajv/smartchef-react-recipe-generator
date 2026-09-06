import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { recipes, pantryItems, weekDays } from "./data/recipes";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import RecipeModal from "./components/RecipeModal";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Planner from "./pages/Planner";
import Pantry from "./pages/Pantry";
import Groceries from "./pages/Groceries";

function App() {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [activePage, setActivePage] = useState("overview");
  const [darkMode, setDarkMode] = useLocalStorage("smartchef-dark", false);
  const [pantry, setPantry] = useLocalStorage("smartchef-pantry", pantryItems.slice(0, 7));
  const [favorites, setFavorites] = useLocalStorage("smartchef-favorites", [2, 5]);
  const [groceries, setGroceries] = useLocalStorage("smartchef-groceries", ["Fresh basil", "Greek yogurt", "Limes"]);
  const [mealPlan, setMealPlan] = useLocalStorage("smartchef-plan", { Monday: 2, Tuesday: 5, Wednesday: 1 });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  const greeting = currentTime.getHours() < 12 ? "Good morning" : currentTime.getHours() < 17 ? "Good afternoon" : "Good evening";

  const matchedRecipes = useMemo(() => recipes
    .map((recipe) => ({ ...recipe, match: recipe.ingredients.filter((item) => pantry.includes(item)).length }))
    .filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()) || recipe.tags.some((tag) => tag.includes(query.toLowerCase())))
    .sort((a, b) => b.match - a.match), [pantry, query]);

  const flash = (message) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const addGroceries = (items) => setGroceries((current) => [...new Set([...current, ...items])]);
  const removeGrocery = (item) => setGroceries((current) => current.filter((entry) => entry !== item));

  const renderPage = () => {
    if (activePage === "discover") return <Discover recipes={matchedRecipes} query={query} setQuery={setQuery} favorites={favorites} toggleFavorite={toggleFavorite} selectRecipe={setSelectedRecipe} />;
    if (activePage === "planner") return <Planner recipes={recipes} days={weekDays} mealPlan={mealPlan} setMealPlan={setMealPlan} />;
    if (activePage === "pantry") return <Pantry items={pantry} allItems={pantryItems} setItems={setPantry} />;
    if (activePage === "groceries") return <Groceries items={groceries} addItems={addGroceries} removeItem={removeGrocery} />;
    return <Dashboard pantry={pantry} recipes={matchedRecipes} favorites={favorites} mealPlan={mealPlan} groceries={groceries} selectRecipe={setSelectedRecipe} toggleFavorite={toggleFavorite} setPage={setActivePage} flash={flash} greeting={greeting} currentTime={currentTime} />;
  };

  return <div className={darkMode ? "app dark" : "app"}>
    <Sidebar activePage={activePage} setPage={setActivePage} pantryCount={pantry.length} groceryCount={groceries.length} />
    <div className="workspace">
      <Topbar darkMode={darkMode} setDarkMode={setDarkMode} query={query} setQuery={setQuery} setPage={setActivePage} currentTime={currentTime} />
      {notice && <div className="toast">✓ {notice}</div>}
      <main>{renderPage()}</main>
      <footer><span>SMARTCHEF / KITCHEN OS</span><span>Plan less. Cook better.</span></footer>
    </div>
    {selectedRecipe && <RecipeModal recipe={selectedRecipe} favorite={favorites.includes(selectedRecipe.id)} toggleFavorite={toggleFavorite} addGroceries={addGroceries} close={() => setSelectedRecipe(null)} flash={flash} />}
  </div>;
}
export default App;
