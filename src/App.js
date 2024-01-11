import "./App.css";
import LanguageSelector from "./components/LanguageSelector";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { useTranslation } from "react-i18next";
import logo from "./assets/tddio.png";
import { BrowserRouter, Route, Link } from "react-router-dom";

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} alt="tdd.io logo" width="60" />
            tdd.io
          </Link>
          <ul className="navbar-nav">
            <Link className="nav-link" to="/signup" title="Sign Up">{t("signup")}</Link>
            <Link className="nav-link" to="/login" title="Login">{t("login")}</Link>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/user/:id" component={UserPage} />
        <div className="language-selector-container">
          <LanguageSelector />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
