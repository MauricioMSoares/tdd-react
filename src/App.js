import LanguageSelector from "./components/LanguageSelector";
import SignupPage from "./pages/SignupPage";
import "./App.css";

function App() {
  return (
    <div className="container">
      <SignupPage />
      <div className="language-selector-container">
        <LanguageSelector />
      </div>
    </div>
  );
}

export default App;
