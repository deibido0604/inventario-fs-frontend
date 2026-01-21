import { useTranslate, useMountEffect } from "@hooks";
import { permissions } from "@utils";
import { PageTitle, Card } from "@components";
import { ProductTable } from "../components/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import { productsListAction } from "../store/thunks";
import { clearProducts } from "../store/productSlice";

const Products = () => {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { productsList } = useSelector((state) => state.products);

  useMountEffect({
    effect: () => {
      dispatch(productsListAction());
    },
    unMount: () => {
      dispatch(clearProducts());
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
        title={t("app.products")}
        permissions={{
          action: permissions.Actions.UPDATE,
          subject: permissions.Subjects.PRODUCTS,
        }}
      />
      <Card>
        <ProductTable
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          t={t}
          data={productsList}
        />
      </Card>
    </>
  );
};

export default Products;
