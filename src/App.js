import "./App.css";
import LanguageSelector from "./components/LanguageSelector";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import logo from "./assets/tddio.png";

function App() {
  const { t } = useTranslation();
  const [path, setPath] = useState(window.location.pathname);

  const onClickLink = (event) => {
    event.preventDefault();
    const newPath = event.currentTarget.attributes.href.value;
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/" title="Home" onClick={onClickLink}>
            <img src={logo} alt="tdd.io logo" width="60" />
            tdd.io
          </a>
          <ul className="navbar-nav">
            <a className="nav-link" href="/signup" title="Sign Up" onClick={onClickLink}>{t("signup")}</a>
            <a className="nav-link" href="/login" title="Login" onClick={onClickLink}>{t("login")}</a>
          </ul>
        </div>
      </nav>
      <div className="container">
        {window.location.pathname === "/" && <HomePage />}
        {window.location.pathname === "/signup" && <SignupPage />}
        {window.location.pathname === "/login" && <LoginPage />}
        {window.location.pathname.startsWith("/user/") && <UserPage />}
        <div className="language-selector-container">
          <LanguageSelector />
        </div>
      </div>
    </>
  );
}

export default App;
