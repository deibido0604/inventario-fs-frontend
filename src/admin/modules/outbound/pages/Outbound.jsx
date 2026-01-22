import { PageTitle, Card } from "@components";
import { useTranslate } from "@hooks";
import { permissions } from "@utils";
import OutboundForm from "./OutboundForm";

const OutboundPage = () => {
  const { t } = useTranslate();

  return (
    <>
      <PageTitle
        title={t("app.add_outbound")}
        permissions={{
          action: permissions.Actions.UPDATE,
          subject: permissions.Subjects.OUTBOUND,
        }}
      />
      <Card>
        <OutboundForm/>
      </Card>
    </>
  );
};

export default OutboundPage;
