import { useEffect, useState, useMemo } from "react";
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
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslate, useLocalStorage, useMountEffect } from "@hooks";
import { useDispatch, useSelector } from "react-redux";
import { branchListForUserAction, clearBranchForUser } from "../../branch/store";

const { Option } = Select;

const OutboundForm = () => {
  const { t } = useTranslate();
  const [form] = Form.useForm();
  const { getItemWithDecryptionDash } = useLocalStorage();
  const dispatch = useDispatch();

  const storedData = getItemWithDecryptionDash("data");

  const [gridData, setGridData] = useState([]);
  const [branchDestinationGrid, setBranchDestinationGrid] = useState(null);

  const { branchesForUser } = useSelector((state) => state.branch);

  useMountEffect({
    effect: () => {
      dispatch(branchListForUserAction({ userId: storedData.user.id }));
    },
    unMount: () => {
      dispatch(clearBranchForUser());
    },
    deps: [],
  });

  /* ==================== DATA SIMULADA DE PRODUCTOS ==================== */
  const products = [
    {
      _id: "P1",
      code: "ASP-500",
      name: "Aspirina 500mg",
      cost: 25,
      stock: 200,
      lots: [
        { lot: "L001", qty: 100, exp: "2026-02-01" },
        { lot: "L002", qty: 100, exp: "2026-05-01" },
      ],
    },
    {
      _id: "P2",
      code: "PAR-1000",
      name: "Paracetamol 1g",
      cost: 30,
      stock: 150,
      lots: [{ lot: "L010", qty: 150, exp: "2026-03-15" }],
    },
  ];

  /* ==================== EFECTOS ==================== */
  useEffect(() => {
    if (storedData?.branch?.name) {
      form.setFieldsValue({
        branch_origin: storedData.branch.name,
      });
    }
  }, [storedData, form]);

  /* ==================== PRODUCTOS ==================== */
  const handleCheckAvailability = () => {
    const productId = form.getFieldValue("product");
    const quantity = form.getFieldValue("quantity");

    if (!productId || !quantity) {
      alert("Seleccione producto y cantidad");
      return;
    }

    const product = products.find((p) => p._id === productId);

    if (quantity > product.stock) {
      alert("Inventario insuficiente");
      return;
    }

    alert("Inventario disponible");
  };

  const handleAddToGrid = () => {
    const productId = form.getFieldValue("product");
    const quantity = form.getFieldValue("quantity");
    const branchId = form.getFieldValue("branch_destination");

    if (!productId || !quantity || !branchId) {
      alert("Seleccione producto, cantidad y sucursal");
      return;
    }

    // Validación: si ya hay productos en el grid, solo se permite agregar de la misma sucursal
    if (branchDestinationGrid && branchDestinationGrid !== branchId) {
      const branch = branchesForUser.find((b) => b.value === branchDestinationGrid);
      alert(
        `Los productos ya están asignados a la sucursal ${branch?.name}. No puede cambiar.`
      );
      return;
    }

    const product = products.find((p) => p._id === productId);

    if (quantity > product.stock) {
      alert("Inventario insuficiente");
      return;
    }

    let remaining = quantity;
    const rows = [];

    for (const lot of product.lots) {
      if (remaining <= 0) break;

      const take = Math.min(lot.qty, remaining);
      remaining -= take;

      rows.push({
        key: `${product._id}-${lot.lot}`,
        product_id: product.code,
        product: product.name,
        quantity: take,
        lot: lot.lot,
        cost: product.cost,
        expiration: lot.exp,
        total: take * product.cost,
      });
    }

    setGridData((prev) => [...prev, ...rows]);

    // Guardamos la sucursal destino que se usó
    setBranchDestinationGrid(branchId);

    // Limpiar campos (producto y cantidad)
    form.resetFields(["product", "quantity"]);
  };

  const handleRemoveRow = (key) => {
    setGridData((prev) => prev.filter((row) => row.key !== key));

    // Si eliminamos todos los productos, limpiar la sucursal usada
    if (gridData.length === 1) setBranchDestinationGrid(null);
  };

  /* ==================== TOTALES ==================== */
  const totals = useMemo(() => {
    return gridData.reduce(
      (acc, item) => {
        acc.units += item.quantity;
        acc.amount += item.total;
        return acc;
      },
      { units: 0, amount: 0 }
    );
  }, [gridData]);

  /* ==================== GRID ==================== */
  const columns = [
    { title: "ID", dataIndex: "product_id", width: "8%" },
    { title: "Producto", dataIndex: "product", width: "20%" },
    { title: "Cantidad", dataIndex: "quantity", align: "center" },
    { title: "Lote", dataIndex: "lot" },
    { title: "Costo u.", dataIndex: "cost", align: "right" },
    { title: "Vencimiento", dataIndex: "expiration" },
    {
      title: "Total",
      dataIndex: "total",
      align: "right",
      render: (v) => `L ${v.toFixed(2)}`,
    },
    {
      title: "Acción",
      width: "6%",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleRemoveRow(record.key)}
        />
      ),
    },
  ];

  /* ==================== BOTONES FINALES ==================== */
  const handleCheckBranchLimit = () => {
    if (!branchDestinationGrid) {
      alert("No hay sucursal asignada en los productos del grid");
      return;
    }

    const branch = branchesForUser.find((b) => b.value === branchDestinationGrid);
    const pendingAmount = 4200;

    if (pendingAmount > 5000) {
      alert(`La sucursal ${branch?.name} supera el límite permitido`);
      return;
    }

    alert(`Sucursal ${branch?.name} habilitada para recibir envío`);
  };

  const handleClear = () => {
    setGridData([]);
    setBranchDestinationGrid(null);
    form.resetFields(["branch_destination", "product", "quantity"]);
  };

  const handleSubmit = () => {
    if (!gridData.length) {
      alert("Debe agregar productos");
      return;
    }

    console.log("SALIDA A REGISTRAR:", {
      header: form.getFieldsValue(),
      branch_destination: branchDestinationGrid,
      detail: gridData,
      totals,
    });
  };

  /* ==================== RENDER ==================== */
  return (
    <>
      <Form layout="vertical" form={form}>
        {/* ENCABEZADO */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="branch_origin" label={t("title.branch_origen")}>
              <Input size="large" disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="branch_destination"
              label="Sucursal de destino"
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                placeholder="Seleccione sucursal"
                disabled={!!branchDestinationGrid} // bloquea si ya hay productos en grid
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

        {/* PRODUCTO */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="product"
              label="Producto"
              rules={[{ required: true, message: "Seleccione producto" }]}
            >
              <Select size="large" placeholder="Buscar producto">
                {products.map((p) => (
                  <Option key={p._id} value={p._id}>
                    {p.code} - {p.name} (Stock: {p.stock})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="quantity"
              label="Cantidad"
              rules={[{ required: true, message: "Ingrese cantidad" }]}
            >
              <InputNumber size="large" min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* BOTONES PRODUCTO */}
        <Row gutter={24}>
          <Col span={12} />
          <Col span={6}>
            <Button size="large" onClick={handleCheckAvailability} block>
              Verificar Disponibilidad
            </Button>
          </Col>
          <Col span={6}>
            <Button size="large" type="primary" onClick={handleAddToGrid} block>
              Agregar
            </Button>
          </Col>
        </Row>
      </Form>

      <Divider />

      {/* GRID */}
      <Table columns={columns} dataSource={gridData} pagination={false} bordered />

      {/* TOTALES */}
      <Row justify="end" style={{ marginTop: 16 }}>
        <Col>
          <Space direction="vertical" align="end">
            <strong>Unidades totales: {totals.units}</strong>
            <strong>Costo total: L {totals.amount.toFixed(2)}</strong>
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* BOTONES FINALES */}
      <Row justify="end" gutter={12}>
        <Col>
          <Button onClick={handleCheckBranchLimit}>
            Verificar Límite Sucursal
          </Button>
        </Col>
        <Col>
          <Button onClick={handleClear}>Limpiar</Button>
        </Col>
        <Col>
          <Button
            className="page-button-add"
            type="primary"
            disabled={gridData.length === 0}
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
