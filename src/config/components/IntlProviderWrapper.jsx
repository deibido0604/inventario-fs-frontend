import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import EN_messages from "../locales/en_US.json";
import ES_messages from "../locales/es_ES.json";

const IntlProviderWrapper = ({ children }) => {
  const { locale } = useSelector((state) => state.config);

  const messages = {
    en: EN_messages,
    es: ES_messages,
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale.split("-")[0]]}>
      {children}
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
