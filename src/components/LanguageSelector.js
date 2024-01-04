import { useTranslation } from "react-i18next";

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();

  return (
    <>
      <button title="日本語" onClick={() => i18n.changeLanguage("ja")} className="btn btn-light">日本語</button>
      <button title="English" onClick={() => i18n.changeLanguage("en")} className="btn btn-light px-3">English</button>
    </>
  );
};

export default LanguageSelector;