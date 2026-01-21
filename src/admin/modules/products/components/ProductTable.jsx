import { Space, Table, Tag } from "antd";
import { permissions } from "@utils";
import { FormOutlined } from "@ant-design/icons";
import { Can } from "@components";

export const ProductTable = ({ t, data, handleEdit, handleDelete }) => {
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "index",
      width: "3%",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: "7%",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "15%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "18%",
      ellipsis: true,
      render: (text) => (
        <span title={text}>
          {text
            ? text.length > 50
              ? `${text.substring(0, 50)}...`
              : text
            : "-"}
        </span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      width: "9%",
      filters: [
        { text: "Electrónicos", value: "Electrónicos" },
        { text: "Computación", value: "Computación" },
        { text: "Oficina", value: "Oficina" },
        { text: "General", value: "General" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Subcategoría",
      dataIndex: "subcategory",
      key: "subcategory",
      width: "9%",
    },
    {
      title: "Marca",
      dataIndex: "brand",
      key: "brand",
      width: "7%",
    },
    {
      title: "Costo",
      dataIndex: "unit_cost",
      key: "unit_cost",
      width: "6%",
      align: "right",
      sorter: (a, b) => a.unit_cost - b.unit_cost,
    },
    {
      title: "Precio",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "6%",
      align: "right",
      sorter: (a, b) => a.unit_price - b.unit_price,
    },
    {
      title: "U. Medida",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      width: "6%",
      render: (text) => <Tag color="blue">{text || "unidad"}</Tag>,
    },
    {
      title: "Min",
      dataIndex: "min_stock",
      key: "min_stock",
      width: "5%",
      align: "center",
      sorter: (a, b) => a.min_stock - b.min_stock,
      render: (text) => <Tag color={text > 0 ? "cyan" : "default"}>{text}</Tag>,
    },
    {
      title: "Max",
      dataIndex: "max_stock",
      key: "max_stock",
      width: "5%",
      align: "center",
      sorter: (a, b) => a.max_stock - b.max_stock,
      render: (text) => <Tag color={text > 0 ? "blue" : "default"}>{text}</Tag>,
    },
    {
      title: "Cód. Barras",
      dataIndex: "barcode",
      key: "barcode",
      width: "9%",
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      width: "6%",
      align: "center",
      filters: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: "Acciones",
      key: "action",
      width: "8%",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <a className="table-button-edit" onClick={() => handleEdit(record)}>
            <FormOutlined />
          </a>
          <Can
            I={permissions.Actions.DELETE}
            a={permissions.Subjects.COUPONS}
            passThrough
          >
            {(allowed) =>
              allowed && (
                <PopConfirm
                  title={t("popConfirm.eliminate") + " " + t("title.coupon")}
                  description={t("popConfirmTitle.coupon")}
                  onConfirm={() => handleDelete(record)}
                  content={
                    <a className="table-button-delete">
                      <DeleteOutlined />
                    </a>
                  }
                />
              )
            }
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <Table
      scroll={{
        x: 1500,
      }}
      columns={columns}
      dataSource={data}
      pagination={{
        showTotal: (total) => `Total: ${total}`,
      }}
    />
  );
};
