import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="home-page">
      <h1>{t("home")}</h1>
    </div>
    );
};

export default HomePage;