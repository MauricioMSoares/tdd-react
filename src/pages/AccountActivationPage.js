import { useEffect, useState } from "react";
import { activate } from "../api/apiCalls";
import { useTranslation } from "react-i18next";

const AccountActivationPage = (props) => {
  const { t } = useTranslation();
  const [result, setResult] = useState();

  useEffect(() => {
    activate(props.match.params.token)
    .then(() => {
      setResult("success");
    })
    .catch(() => {
      setResult("failure");
    })
  }, []);

  return (
    <div data-testid="activation-page">
      {
        result === "success" &&
        <div class="alert alert-success mt-3">{t("activatedAccount")}</div>
      }
      {
        result === "failure" &&
        <div class="alert alert-danger mt-3">{t("failedToActivate")}</div>
      }
    </div>
  );
};

export default AccountActivationPage;