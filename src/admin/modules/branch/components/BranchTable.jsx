import { Space, Table, Tag } from "antd";
import { permissions } from "@utils";
import { FormOutlined } from "@ant-design/icons";
import { Can } from "@components";

export const BranchTable = ({ data, handleEdit, handleDelete }) => {
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "index",
      width: "4%",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: "10%",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Sucursal",
      dataIndex: "name",
      key: "name",
      width: "16%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      width: "20%",
      ellipsis: true,
      render: (text) => (
        <span title={text}>
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text || "-"}
        </span>
      ),
    },
    {
      title: "Ciudad",
      dataIndex: "city",
      key: "city",
      width: "10%",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "14%",
      ellipsis: true,
    },
    {
      title: "Encargado",
      dataIndex: ["manager", "name"],
      key: "manager",
      width: "12%",
      render: (_, record) => record.manager?.name || "-",
    },
    {
      title: "Monto Máx.",
      dataIndex: "max_outstanding_amount",
      key: "max_outstanding_amount",
      width: "10%",
      align: "right",
      sorter: (a, b) => a.max_outstanding_amount - b.max_outstanding_amount,
      render: (value) => (
        <Tag color="blue">L {Number(value).toLocaleString()}</Tag>
      ),
    },
    {
      title: "Estado",
      dataIndex: "active",
      key: "active",
      width: "8%",
      align: "center",
      filters: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      onFilter: (value, record) => record.active === value,
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      width: "10%",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <a className="table-button-edit" onClick={() => handleEdit(record)}>
            <FormOutlined />
          </a>

          <Can
            I={permissions.Actions.DELETE}
            a={permissions.Subjects.BRANCHES}
            passThrough
          >
            {(allowed) =>
              allowed && (
                <PopConfirm
                  title="Eliminar sucursal"
                  description="¿Está seguro de eliminar esta sucursal?"
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
