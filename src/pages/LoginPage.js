import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="login-page">
      <h1>{t("login")}</h1>
    </div>
  );
};

export default LoginPage;