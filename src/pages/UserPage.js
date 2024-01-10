import { useTranslation } from "react-i18next";

const UserPage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="user-page">
      <h1>{t("profile")}</h1>
    </div>
  );
};

export default UserPage;