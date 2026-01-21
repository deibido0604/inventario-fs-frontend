import { PlusOutlined } from "@ant-design/icons";
import { CardContent } from "../CardContent";
import { Button, Flex, Select } from "antd";
import { Can } from "@components";
const { Option } = Select;

export const PageTitle = ({
  title,
  addButton,
  permissions,
  addButton2,
  permissions2,
  addButton3,
  permissions3,
  addButton4,
  permissions4,
  addButton5,
  permissions5,
  addButton6,
  permissions6,
  addSelect,
}) => {
  const boxesOp = addSelect ? addSelect.options : null;
  return (
    <CardContent>
      <div className="page-title-button">
        <h2>{title}</h2>
        <Flex gap="small" align="flex-start">
          <Flex gap="small"></Flex>
          {addButton && (
            <Can I={permissions.action} a={permissions.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add"
                    type="primary"
                    disabled={addButton.disabled ? addButton.disabled : false}
                    onClick={addButton.onClick}
                    icon={<PlusOutlined />}
                  >
                    {" "}
                    {addButton.text}{" "}
                  </Button>
                )
              }
            </Can>
          )}
          {addButton2 && (
            <Can I={permissions2.action} a={permissions2.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add page-button-add-classification"
                    type="primary"
                    disabled={addButton2.disabled ? addButton2.disabled : false}
                    onClick={addButton2.onClick}
                    icon={addButton2.icon ? addButton2.icon : <PlusOutlined />}
                  >
                    {" "}
                    {addButton2.text}{" "}
                  </Button>
                )
              }
            </Can>
          )}
          {addSelect && (
            <Select
              className="page-button-add page-select"
              onChange={addSelect.onChange}
              placeholder={addSelect.placeholder}
            >
              {boxesOp
                ? boxesOp.map((item) => (
                    <Option key={item.key} value={item._id}>
                      {item.code}
                    </Option>
                  ))
                : null}
            </Select>
          )}
          {addButton3 && (
            <Can I={permissions3.action} a={permissions3.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add page-button-add-extra"
                    type="primary"
                    disabled={addButton3.disabled || false}
                    onClick={addButton3.onClick}
                    icon={addButton3.icon || <PlusOutlined />}
                  >
                    {addButton3.text}
                  </Button>
                )
              }
            </Can>
          )}
          {addButton4 && (
            <Can I={permissions4.action} a={permissions4.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add page-button-add-classification"
                    type="primary"
                    disabled={addButton4.disabled || false}
                    onClick={addButton4.onClick}
                    icon={addButton4.icon || <PlusOutlined />}
                  >
                    {addButton4.text}
                  </Button>
                )
              }
            </Can>
          )}
          {addButton5 && (
            <Can I={permissions5.action} a={permissions5.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add page-button-add-extra"
                    type="primary"
                    disabled={addButton5.disabled || false}
                    onClick={addButton5.onClick}
                    icon={addButton5.icon || <PlusOutlined />}
                  >
                    {addButton5.text}
                  </Button>
                )
              }
            </Can>
          )}
          {addButton6 && (
            <Can I={permissions6.action} a={permissions6.subject} passThrough>
              {(allowed) =>
                allowed && (
                  <Button
                    className="page-button-add page-button-add-classification"
                    type="primary"
                    disabled={addButton6.disabled || false}
                    onClick={addButton6.onClick}
                    icon={addButton6.icon || <PlusOutlined />}
                  >
                    {addButton6.text}
                  </Button>
                )
              }
            </Can>
          )}
        </Flex>
      </div>
    </CardContent>
  );
};
