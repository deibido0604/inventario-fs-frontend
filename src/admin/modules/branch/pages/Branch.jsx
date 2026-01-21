import { useTranslate, useMountEffect } from "@hooks";
import { permissions } from "@utils";
import { PageTitle, Card } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { branchListAction, clearBranch } from "../store";
import { BranchTable } from "../components/BranchTable";
const Branch = () => {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { branchList } = useSelector((state) => state.branch);

  useMountEffect({
    effect: () => {
      dispatch(branchListAction());
    },
    unMount: () => {
      dispatch(clearBranch());
    },
    deps: [],
  });

  const handleEdit = (record) => {
    console.log(record);
  };

  const handleDelete = () => {};

  return (
    <>
      <PageTitle
        title={t("app.branch")}
        permissions={{
          action: permissions.Actions.UPDATE,
          subject: permissions.Subjects.BRANCH,
        }}
      />
      <Card>
        <BranchTable
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          t={t}
          data={branchList}
        />
      </Card>
    </>
  );
};

export default Branch;
