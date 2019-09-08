import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import {
  message,
  Row,
  Col,
  Spin,
  Tabs,
  Form,
  Table,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
  Input,
  Select
} from "antd";

import { get } from "./../services/services_gateways";
import {
  remove,
  add,
  set,
  listByGateway
} from "./../services/services_Peripherals";

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;

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

const Gataway = props => {
  const {
    gatewayId,
    form,
    form: { getFieldDecorator }
  } = props;

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(true);
  const [loadinglist, setLoadinglist] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [current, setCurrent] = useState({
    uid: "",
    date: "",
    vendor: "",
    status: ""
  });
  const [peripherals, setPeripherals] = useState([]);

  useEffect(() => {
    fetchGateway();
    list();
  }, []);

  const operations = (
    <Button
      disabled={peripherals.length === 10}
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

  const columns = [
    {
      title: "UUID",
      dataIndex: "uid",
      key: "uid"
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },

    {
      title: "Action",
      key: "action",
      width: 120,
      render: (text, record) => (
        <span>
          <Tooltip title="Edit Peripherals">
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
            title="Are you sure delete this Peripheral?"
            onConfirm={() => {
              removePeripheral(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Remove Peripheral">
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

  const fetchGateway = async () => {
    try {
      const response = await get(gatewayId);
      if (response.data) {
        setCurrent(response.data);
      } else {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const list = async () => {
    try {
      setLoadinglist(true);
      const response = await listByGateway(gatewayId);
      setPeripherals(response.data);
      setLoadinglist(false);
    } catch (error) {
      setLoadinglist(false);
      message.error(error.message);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const hideModal = () => {
    setVisible(false);
    setVisibleEdit(false);
    setCurrent({
      uid: "",
      date: "",
      vendor: "",
      status: ""
    });

    handleReset();
    setTimeout(() => {
      setMode("add");
    }, 1000);
  };

  const removePeripheral = async id => {
    try {
      setLoading(true);
      await remove(id);
      setLoading(false);

      list();
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
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
          vendor: values.vendor,
          status: values.status,
          gateway: gatewayId
        };
        setLoading(true);

        if (mode === "add") {
          try {
            await add(form);
            handleReset();
            list();
            hideModal();
            setLoading(false);
          } catch (error) {
            setLoading(false);
            message.error(error.message);
          }
        } else if (mode === "edit") {
          try {
            await set(form);
            handleReset();
            list();
            hideModal();
            setLoading(false);
          } catch (error) {
            setLoading(false);
            message.error(error.message);
          }
        }
      }
    });
  };

  return (
    <Spin spinning={loading}>
      <Row>
        <Col xs={24} md={12} lg={6}>
          <strong>Name: </strong> {current.name}
        </Col>
        <Col xs={24} md={12} lg={6}>
          <strong>Ipv4: </strong> {current.ipv4}
        </Col>
        <Col xs={24} md={12} lg={12}>
          <strong>Serial: </strong> {current.serial}
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col>
          <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
            <TabPane tab="Peripherals" key="1">
              <Table
                rowKey="uid"
                loading={loadinglist}
                dataSource={peripherals}
                columns={columns}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

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
              <FormItem label="Vendor" hasFeedback>
                {getFieldDecorator("vendor", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter the vendor field!"
                    }
                  ]
                })(<Input type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="Status" hasFeedback>
                {getFieldDecorator("status", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter the status field!"
                    }
                  ]
                })(
                  <Select placeholder="Select a option and change input text above">
                    <Option value="offline">Offline</Option>
                    <Option value="online">Online</Option>
                  </Select>
                )}
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
              <FormItem label="UUID" hasFeedback>
                {getFieldDecorator("uid", {
                  initialValue: current.uid
                })(<Input disabled type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="Date" hasFeedback>
                {getFieldDecorator("date", {
                  initialValue: current.date
                })(<Input disabled type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="Vendor" hasFeedback>
                {getFieldDecorator("vendor", {
                  initialValue: current.vendor,
                  rules: [
                    {
                      required: true,
                      message: "Please enter the vendor field!"
                    }
                  ]
                })(<Input type="text" />)}
              </FormItem>
            </Col>
            <Col xs={24}>
              <FormItem label="Status" hasFeedback>
                {getFieldDecorator("status", {
                  initialValue: current.status,
                  rules: [
                    {
                      required: true,
                      message: "Please enter the status field!"
                    }
                  ]
                })(
                  <Select placeholder="Select a option and change input text above">
                    <Option value="offline">Offline</Option>
                    <Option value="online">Online</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Spin>
  );
};

const WrappedGateway = Form.create()(Gataway);

export default WrappedGateway;
