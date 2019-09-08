import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import {
  Tabs,
  Button,
  Table,
  Tooltip,
  message,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Popconfirm
} from "antd";
import { list, add, remove, set } from "./../services/services_gateways";

const { TabPane } = Tabs;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

export const Gateways = props => {
  const {
    form,
    form: { getFieldDecorator }
  } = props;

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const operations = (
    <Button
      loading={loading}
      onClick={() => {
        showModal("add");
      }}
      type="primary"
      icon="plus"
    >
      Add
    </Button>
  );

  const fetch = async () => {
    try {
      const response = await list();
      if (response.data) setGateways(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const removeGateway = async id => {
    try {
      setLoading(true);
      await remove(id);
      fetch();
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const hideModal = () => {
    setVisible(false);
    setVisibleEdit(false);

    handleReset();
    setTimeout(() => {
      setMode("add");
    }, 1000);
  };

  const showModal = (mode, current) => {
    setMode(mode);

    if (mode === "edit") {
      setVisibleEdit(true);
      setCurrent(current);
    } else {
      setVisible(true);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields(async (err, values) => {
      if (!err) {
        const form = {
          id: current._id || null,
          name: values.name,
          ipv4: values.ipv4
        };
        setLoading(true);

        if (mode === "add") {
          try {
            await add(form);
            handleReset();
            fetch();
            hideModal();
          } catch (error) {
            setLoading(false);
            message.error(error.message);
          }
        } else if (mode === "edit") {
          try {
            await set(form);
            handleReset();
            fetch();
            hideModal();
          } catch (error) {
            setLoading(false);
            message.error(error.message);
          }
        }
      }
    });
  };

  const validateIpAddress = (rule, value, callback) => {
    if (
      value &&
      value.length >= 7 &&
      value.length <= 15 &&
      !isNaN(value[value.length - 1]) &&
      !isNaN(value[0])
    ) {
      let count = 0;
      let point = 0;
      let incorrect = false;
      for (let i = 0; i < value.length; i++) {
        if (!isNaN(value[i])) {
          count++;
          if (count > 3) {
            callback("The Ip Address is Incorrect! Ex. (192.168.0.254)");
            break;
          }
        } else {
          if (value[i] === ".") {
            point++;
            count = 0;
            if (point.length > 3) {
              callback("The Ip Address is Incorrect! Ex. (192.168.0.254)");
              break;
            }
          } else {
            incorrect = true;
            break;
          }
        }
      }

      if (incorrect) {
        callback("The Ip Address is Incorrect! Ex. (192.168.0.254)");
      }
      callback();
    } else {
      if (value.length > 0)
        callback("The Ip Address is Incorrect! Ex. (192.168.0.254)");
      callback();
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "IPV4",
      dataIndex: "ipv4",
      key: "ipv4"
    },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial"
    },

    {
      title: "Action",
      key: "action",
      width: 120,
      render: (text, record) => (
        <span>
          <Tooltip title="Show Peripherals">
            <Button
              onClick={() => {
                navigate(`/gateways/${record._id}`);
              }}
              style={{ margin: "0 2px" }}
              shape="circle"
              size="small"
              type="primary"
              ghost
              icon="eye"
            ></Button>
          </Tooltip>
          <Tooltip title="Edit Gateway">
            <Button
              onClick={() => {
                showModal("edit", record);
              }}
              style={{ margin: "0 2px" }}
              shape="circle"
              size="small"
              type="primary"
              ghost
              icon="edit"
            ></Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure delete this Gateway?"
            onConfirm={() => {
              removeGateway(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Remove Gateway">
              <Button
                style={{ margin: "0 2px" }}
                shape="circle"
                size="small"
                type="danger"
                ghost
                icon="delete"
              ></Button>
            </Tooltip>
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
        <TabPane tab="All Gateways" key="1">
          <Table
            rowKey="_id"
            loading={loading}
            dataSource={gateways}
            columns={columns}
          />
        </TabPane>
      </Tabs>
      <Modal
        centered
        width={600}
        title="Add Gateway"
        visible={visible}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Add
          </Button>
        ]}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit} autocomplete="off">
          <Row justify="center" type="flex">
            <Col xs={24}>
              <FormItem label="Name" hasFeedback>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter the name field!"
                    }
                  ]
                })(<Input type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="IPV4" hasFeedback>
                {getFieldDecorator("ipv4", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter the IPV4 field!"
                    },
                    {
                      validator: validateIpAddress
                    }
                  ]
                })(<Input type="text" placeholder="192.168.0.254" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        centered
        width={600}
        title="Edit Gateway"
        visible={visibleEdit}
        onOk={hideModal}
        onCancel={hideModal}
        footer={[
          <Button key="back" onClick={hideModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Save
          </Button>
        ]}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit} autocomplete="off">
          <Row justify="center" type="flex">
            <Col xs={24}>
              <FormItem label="Name" hasFeedback>
                {getFieldDecorator("name", {
                  initialValue: current.name,
                  rules: [
                    {
                      required: true,
                      message: "Please enter the name field!"
                    }
                  ]
                })(<Input type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="IPV4" hasFeedback>
                {getFieldDecorator("ipv4", {
                  initialValue: current.ipv4,
                  rules: [
                    {
                      required: true,
                      message: "Please enter the IPV4 field!"
                    },
                    {
                      validator: validateIpAddress
                    }
                  ]
                })(<Input type="text" placeholder="192.168.0.254" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="IPV4" hasFeedback>
                {getFieldDecorator("serial", {
                  initialValue: current.serial
                })(<Input disabled type="text" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

const WrappedGateways = Form.create()(Gateways);

export default WrappedGateways;
