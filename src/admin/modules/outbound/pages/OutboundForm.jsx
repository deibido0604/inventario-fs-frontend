import { useEffect, useState, useCallback } from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Button,
  Table,
  InputNumber,
  Divider,
  Space,
  message,
  Modal,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocalStorage, useMountEffect } from "@hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  branchListForUserAction,
  clearBranchForUser,
} from "../../branch/store";
import {
  availableProductListAction,
  checkProductAvailabilityAction,
  checkBranchLimitAction,
  createOutboundAction,
  clearAvailabilityResult,
  clearLimitCheck,
  clearOutboundCreated,
} from "../../outbound/store";

const { Option } = Select;
const { confirm } = Modal;

const calculateTotals = (gridData) => {
  return gridData.reduce(
    (acc, item) => {
      acc.units += item.quantity;
      acc.amount += item.total;
      return acc;
    },
    { units: 0, amount: 0 },
  );
};

const OutboundForm = () => {
  const [form] = Form.useForm();
  const { getItemWithDecryptionDash } = useLocalStorage();
  const dispatch = useDispatch();
  
  const storedData = getItemWithDecryptionDash("data");
  
  const [gridData, setGridData] = useState([]);
  const [branchDestinationGrid, setBranchDestinationGrid] = useState(null);
  
  const { branchesForUser } = useSelector((state) => state.branch);
  const {
    availableProductList,
    availabilityResult,
    limitCheck,
    isLoading: loadingProducts,
    availabilityLoading,
    limitLoading,
    creatingOutbound,
    outboundCreated,
  } = useSelector((state) => state.outbound);

  const loadAvailableProducts = useCallback(() => {
    if (storedData?.branch?._id) {
      dispatch(availableProductListAction({ branchId: storedData.branch._id }));
    }
  }, [dispatch, storedData]);

  const loadBranches = useCallback(() => {
    if (storedData?.user?.id) {
      dispatch(branchListForUserAction({ userId: storedData.user.id }));
    }
  }, [dispatch, storedData]);

  useMountEffect({
    effect: () => {
      loadBranches();
      loadAvailableProducts();
    },
    unMount: () => {
      dispatch(clearBranchForUser());
      dispatch(clearAvailabilityResult());
      dispatch(clearLimitCheck());
    },
    deps: [],
  });

  useEffect(() => {
    if (outboundCreated) {
      message.success(
        `Salida registrada: ${outboundCreated.outbound_number || "exitosa"}`
      );
      loadAvailableProducts();
      dispatch(clearOutboundCreated());
    }
  }, [outboundCreated, dispatch, loadAvailableProducts]);

  useEffect(() => {
    if (storedData?.branch?.name) {
      form.setFieldsValue({
        branch_origin: storedData.branch.name,
      });
    }
  }, [storedData, form]);

  const handleCheckAvailability = () => {
    const productId = form.getFieldValue("product");
    const quantity = form.getFieldValue("quantity");
    const branchId = storedData?.branch?._id;

    if (!productId || !quantity || !branchId) {
      message.warning("Complete todos los campos");
      return;
    }

    dispatch(
      checkProductAvailabilityAction({
        productId,
        quantity,
        user: storedData.user.id,
      })
    );
  };

  const handleAddToGrid = () => {
    if (!availabilityResult || !availabilityResult.isAvailable) {
      message.warning("Primero verifique la disponibilidad");
      return;
    }

    const productId = form.getFieldValue("product");
    const branchId = form.getFieldValue("branch_destination");

    const product = availableProductList.find((p) => p.productId === productId);
    if (!product) {
      message.error("Producto no encontrado");
      return;
    }

    if (branchDestinationGrid && branchDestinationGrid !== branchId) {
      const branch = branchesForUser.find(
        (b) => b.value === branchDestinationGrid
      );
      message.error(
        `Los productos ya están asignados a la sucursal ${branch?.name}`
      );
      return;
    }

    const newRows = availabilityResult.batches.map((batch) => ({
      key: `${productId}-${batch.batchId}`,
      product_id: product.code,
      product: product.name,
      productId: productId,
      batchId: batch.batchId,
      quantity: batch.quantity,
      lot: batch.batchNumber,
      cost: batch.unitCost,
      expiration: batch.expirationDate
        ? new Date(batch.expirationDate).toISOString().split("T")[0]
        : "Sin fecha",
      total: batch.totalCost,
    }));

    setGridData((prev) => [...prev, ...newRows]);
    setBranchDestinationGrid(branchId);
    dispatch(clearAvailabilityResult());
    form.resetFields(["product", "quantity"]);

    message.success("Producto agregado al grid");
  };

  const handleCheckBranchLimit = () => {
    const destinationBranchId = form.getFieldValue("branch_destination");

    if (!destinationBranchId) {
      message.warning("Seleccione una sucursal destino");
      return;
    }

    dispatch(checkBranchLimitAction({ branchId: destinationBranchId }));
  };

  const handleSubmit = () => {
    if (gridData.length === 0) {
      message.warning("Debe agregar productos");
      return;
    }

    if (!limitCheck || !limitCheck.withinLimit) {
      message.warning("Verifique el límite de la sucursal primero");
      return;
    }

    const totals = calculateTotals(gridData);

    confirm({
      title: "¿Confirmar registro de salida?",
      icon: <ExclamationCircleOutlined />,
      content: `Total: ${totals.units} unidades - L ${totals.amount.toFixed(2)}`,
      onOk: () => {
        const itemsMap = new Map();
        gridData.forEach((item) => {
          if (!itemsMap.has(item.productId)) {
            itemsMap.set(item.productId, 0);
          }
          itemsMap.set(
            item.productId,
            itemsMap.get(item.productId) + item.quantity
          );
        });

        const items = Array.from(itemsMap.entries()).map(
          ([productId, quantity]) => ({
            productId,
            quantity,
          })
        );

        const payload = {
          user: storedData.user.id,
          destination_branch: branchDestinationGrid,
          notes: form.getFieldValue("notes") || "",
          items,
        };

        dispatch(createOutboundAction(payload));
      },
    });
  };

  const handleRemoveRow = (key) => {
    setGridData((prev) => prev.filter((row) => row.key !== key));

    if (gridData.length === 1) {
      setBranchDestinationGrid(null);
      dispatch(clearLimitCheck());
    }
  };

  const handleClear = () => {
    setGridData([]);
    setBranchDestinationGrid(null);
    dispatch(clearAvailabilityResult());
    dispatch(clearLimitCheck());
    form.resetFields(["branch_destination", "product", "quantity", "notes"]);
  };

  const totals = calculateTotals(gridData);

  const columns = [
    { title: "ID", dataIndex: "product_id", width: "10%" },
    { title: "Producto", dataIndex: "product", width: "20%" },
    { title: "Cantidad", dataIndex: "quantity", align: "center" },
    { title: "Lote", dataIndex: "lot" },
    {
      title: "Costo u.",
      dataIndex: "cost",
      align: "right",
      render: (v) => `L ${typeof v === "number" ? v.toFixed(2) : "0.00"}`,
    },
    { title: "Vencimiento", dataIndex: "expiration" },
    {
      title: "Total",
      dataIndex: "total",
      align: "right",
      render: (v) => `L ${typeof v === "number" ? v.toFixed(2) : "0.00"}`,
    },
    {
      title: "Acción",
      width: "8%",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleRemoveRow(record.key)}
        />
      ),
    },
  ];

  return (
    <>
      <Form layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="branch_origin" label="Sucursal de origen">
              <Input
                size="large"
                disabled
                value={storedData?.branch?.name || ""}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="branch_destination"
              label="Sucursal de destino"
              rules={[
                { required: true, message: "Seleccione sucursal destino" },
              ]}
            >
              <Select
                size="large"
                placeholder="Seleccione sucursal"
                disabled={!!branchDestinationGrid || limitLoading}
                loading={limitLoading}
              >
                {branchesForUser.map((b) => (
                  <Option key={b.key} value={b.value}>
                    {b.name} ({b.city})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={10}>
            <Form.Item
              name="product"
              label="Producto"
              rules={[{ required: true, message: "Seleccione producto" }]}
            >
              <Select
                size="large"
                placeholder="Buscar producto"
                showSearch
                optionFilterProp="children"
                disabled={!!branchDestinationGrid || loadingProducts}
                loading={loadingProducts}
              >
                {availableProductList.map((p) => (
                  <Option key={p.productId} value={p.productId}>
                    {p.code} - {p.name} (Stock: {p.totalStock})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="quantity"
              label="Cantidad"
              rules={[{ required: true, message: "Ingrese cantidad" }]}
            >
              <InputNumber
                size="large"
                min={1}
                style={{ width: "100%" }}
                disabled={!!branchDestinationGrid || availabilityLoading}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="notes" label="Observaciones">
              <Input.TextArea
                rows={1}
                placeholder="Notas opcionales"
                disabled={!!branchDestinationGrid}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={12} />
          <Col span={6}>
            <Button
              size="large"
              onClick={handleCheckAvailability}
              block
              loading={availabilityLoading}
              disabled={!!branchDestinationGrid}
            >
              Verificar Disponibilidad
            </Button>
          </Col>
          <Col span={6}>
            <Button
              size="large"
              type="primary"
              onClick={handleAddToGrid}
              block
              disabled={
                !availabilityResult?.isAvailable || 
                !!branchDestinationGrid || 
                availabilityLoading
              }
            >
              Agregar
            </Button>
          </Col>
        </Row>
      </Form>

      <Divider />

      <Table
        columns={columns}
        dataSource={gridData}
        pagination={false}
        bordered
        size="small"
        locale={{ emptyText: "No hay productos agregados" }}
      />

      <Row justify="end" style={{ marginTop: 16 }}>
        <Col>
          <Space direction="vertical" align="end" size="large">
            <div>
              <strong>Unidades totales: {totals.units}</strong>
            </div>
            <div>
              <strong>Costo total: L {totals.amount.toFixed(2)}</strong>
            </div>
            {limitCheck && (
              <div
                style={{ color: limitCheck.withinLimit ? "green" : "orange" }}
              >
                <small>{limitCheck.message}</small>
              </div>
            )}
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* BOTONES FINALES */}
      <Row justify="end" gutter={12}>
        <Col>
          <Button
            onClick={handleCheckBranchLimit}
            loading={limitLoading}
            disabled={!branchDestinationGrid}
          >
            Verificar Límite Sucursal
          </Button>
        </Col>
        <Col>
          <Button onClick={handleClear} disabled={creatingOutbound}>
            Limpiar
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            loading={creatingOutbound}
            disabled={gridData.length === 0 || !limitCheck?.withinLimit}
            onClick={handleSubmit}
          >
            Registrar Salida
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default OutboundForm;