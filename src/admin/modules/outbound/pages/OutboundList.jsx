import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  Card,
  Space,
  Tag,
  Modal,
  message,
  Statistic,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "@hooks";
import moment from "moment";
import { branchListForUserAction } from "../../branch/store";
import {
  cancelOutboundAction,
  clearFilters,
  clearOutboundCancelled,
  clearOutboundReceived,
  clearStats,
  getOutboundStatsAction,
  listOutboundsAction,
  receiveOutboundAction,
  setFilters,
} from "../store";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const initialFilters = {
  startDate: null,
  endDate: null,
  destination_branch: null,
  status: null,
  search: "",
};

const OutboundList = () => {
  const dispatch = useDispatch();
  const { getItemWithDecryptionDash } = useLocalStorage();
  
  const storedDataRef = useRef(null);
  if (storedDataRef.current === null) {
    storedDataRef.current = getItemWithDecryptionDash("data");
  }
  const storedData = storedDataRef.current;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const {
    outboundsList = [],
    outboundsLoading = false,
    filters = initialFilters,
    receivingOutbound = false,
    cancellingOutbound = false,
    stats = null,
    statsLoading = false,
  } = useSelector((state) => state.outbound || {});

  const { branchesForUser = [] } = useSelector((state) => state.branch || {});

  const loadBranches = useCallback(() => {
    if (storedData?.user?.id) {
      dispatch(branchListForUserAction({ userId: storedData.user.id }));
    }
  }, [dispatch, storedData]);

  const loadOutbounds = useCallback(() => {
    if (!storedData?.user?.id) return;

    const params = {
      user: storedData.user.id,
      ...filters,
    };

    if (filters.startDate && filters.endDate) {
      params.startDate = moment(filters.startDate).format("YYYY-MM-DD");
      params.endDate = moment(filters.endDate).format("YYYY-MM-DD");
    }

    dispatch(listOutboundsAction(params));
  }, [dispatch, storedData, filters]);

  const loadStats = useCallback(() => {
    if (!storedData?.user?.id) return;

    const params = {
      user: storedData.user.id,
    };

    if (filters.startDate && filters.endDate) {
      params.startDate = moment(filters.startDate).format("YYYY-MM-DD");
      params.endDate = moment(filters.endDate).format("YYYY-MM-DD");
    }

    dispatch(getOutboundStatsAction(params));
  }, [dispatch, storedData, filters]);

  useEffect(() => {
    if (storedData?.user?.id) {
      loadBranches();
      loadOutbounds();
      loadStats();
    }

    return () => {
      dispatch(clearStats());
    };
  }, []);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleApplyFilters = () => {
    loadOutbounds();
    loadStats();
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSelectedRowKeys([]);
    setTimeout(() => {
      loadOutbounds();
      loadStats();
    }, 100);
  };

  const handleReceiveOutbound = (record) => {
    if (!storedData?.user?.id) return;

    confirm({
      title: "¿Confirmar recepción de salida?",
      content: `Número: ${record.outbound_number}\nSucursal destino: ${record.destination_branch?.name}`,
      onOk: () => {
        dispatch(
          receiveOutboundAction({
            id: record._id,
            user: storedData.user.id,
          })
        )
          .unwrap()
          .then(() => {
            message.success("Salida recibida exitosamente");
            loadOutbounds();
            dispatch(clearOutboundReceived());
          })
          .catch((error) => {
            message.error(error.message || "Error al recibir salida");
          });
      },
    });
  };

  const handleCancelOutbound = (record) => {
    if (!storedData?.user?.id) return;

    confirm({
      title: "¿Confirmar cancelación de salida?",
      content: `Número: ${record.outbound_number}\nEsta acción no se puede deshacer.`,
      onOk: () => {
        dispatch(
          cancelOutboundAction({
            id: record._id,
            user: storedData.user.id,
          })
        )
          .unwrap()
          .then(() => {
            message.success("Salida cancelada exitosamente");
            loadOutbounds();
            dispatch(clearOutboundCancelled());
          })
          .catch((error) => {
            message.error(error.message || "Error al cancelar salida");
          });
      },
    });
  };

  const canReceiveOutbound = (record) => {
    if (record.status !== "Enviada a sucursal") return false;

    const userBranch = branchesForUser.find(
      (b) => b.value === record.destination_branch?._id
    );

    return !!userBranch;
  };

  const canCancelOutbound = (record) => {
    if (record.status !== "Enviada a sucursal") return false;

    const userBranch = branchesForUser.find(
      (b) => b.value === record.source_branch?._id
    );

    return !!userBranch;
  };

  const columns = [
    {
      title: "Número de Salida",
      dataIndex: "outbound_number",
      key: "outbound_number",
      width: 120,
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "date",
      width: 100,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Sucursal Origen",
      dataIndex: "source_branch",
      key: "source_branch",
      width: 150,
      render: (branch) => branch?.name || "N/A",
    },
    {
      title: "Sucursal Destino",
      dataIndex: "destination_branch",
      key: "destination_branch",
      width: 150,
      render: (branch) => branch?.name || "N/A",
    },
    {
      title: "Unidades Totales",
      dataIndex: "total_units",
      key: "total_units",
      width: 100,
      align: "center",
      render: (units) => units || 0,
    },
    {
      title: "Costo Total",
      dataIndex: "total_cost",
      key: "total_cost",
      width: 120,
      align: "right",
      render: (cost) => `L ${parseFloat(cost || 0).toFixed(2)}`,
      sorter: (a, b) => (a.total_cost || 0) - (b.total_cost || 0),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        let color = "default";
        let text = status || "N/A";

        switch (status) {
          case "Enviada a sucursal":
            color = "blue";
            break;
          case "Recibido en sucursal":
            color = "green";
            break;
          case "Cancelada":
            color = "red";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      width: 120,
      render: (user) => user?.name || user?.username || "N/A",
    },
    {
      title: "Recibido por",
      dataIndex: "received_by",
      key: "received_by",
      width: 120,
      render: (user) => user?.name || user?.username || "N/A",
    },
    {
      title: "Fecha Recibido",
      dataIndex: "received_date",
      key: "received_date",
      width: 120,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {canReceiveOutbound(record) && (
            <Tooltip title="Recibir salida">
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                loading={receivingOutbound}
                onClick={() => handleReceiveOutbound(record)}
              >
                Recibir
              </Button>
            </Tooltip>
          )}

          {canCancelOutbound(record) && (
            <Tooltip title="Cancelar salida">
              <Button
                type="default"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                loading={cancellingOutbound}
                onClick={() => handleCancelOutbound(record)}
              >
                Cancelar
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Ver detalles">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                message.info("Función de detalles en desarrollo");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filterPanel = (
    <Card
      size="small"
      title={
        <Space>
          <FilterOutlined />
          Filtros
        </Space>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Ocultar" : "Mostrar"}
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      {showFilters && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              value={[filters.startDate, filters.endDate]}
              onChange={(dates) => {
                handleFilterChange("startDate", dates?.[0] || null);
                handleFilterChange("endDate", dates?.[1] || null);
              }}
              format="DD/MM/YYYY"
              placeholder={["Fecha inicio", "Fecha fin"]}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Sucursal Destino"
              style={{ width: "100%" }}
              value={filters.destination_branch}
              onChange={(value) =>
                handleFilterChange("destination_branch", value)
              }
              allowClear
            >
              {branchesForUser.map((branch) => (
                <Option key={branch.value} value={branch.value}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Estado"
              style={{ width: "100%" }}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              allowClear
            >
              <Option value="Enviada a sucursal">Enviada a sucursal</Option>
              <Option value="Recibido en sucursal">Recibido en sucursal</Option>
              <Option value="Cancelada">Cancelada</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Input
              placeholder="Buscar por número..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onPressEnter={handleApplyFilters}
              allowClear
            />
          </Col>

          <Col xs={24}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleApplyFilters}
                loading={outboundsLoading}
              >
                Buscar
              </Button>

              <Button onClick={handleClearFilters} disabled={outboundsLoading}>
                Limpiar
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={loadOutbounds}
                loading={outboundsLoading}
              >
                Actualizar
              </Button>
            </Space>
          </Col>
        </Row>
      )}
    </Card>
  );

  const statsPanel = stats && (
    <Card size="small" style={{ marginBottom: 16 }} loading={statsLoading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Statistic
            title="Total Salidas"
            value={stats.totals?.total || 0}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Unidades Totales"
            value={stats.totals?.totalUnits || 0}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Costo Total"
            value={stats.totals?.totalCost || 0}
            precision={2}
            prefix="L"
            loading={statsLoading}
          />
        </Col>

        {stats.byStatus?.map((statusStat) => (
          <Col xs={24} sm={8} key={statusStat._id}>
            <Card size="small">
              <Statistic
                title={statusStat._id}
                value={statusStat.count}
                suffix={` (L ${statusStat.totalCost?.toFixed(2) || 0})`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Listado de Salidas de Inventario</h2>

      {filterPanel}
      {statsPanel}

      <Card>
        <Table
          columns={columns}
          dataSource={outboundsList}
          loading={outboundsLoading}
          rowKey="_id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} salidas`,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          locale={{
            emptyText: "No hay salidas registradas",
          }}
        />
      </Card>
    </div>
  );
};

export default OutboundList;