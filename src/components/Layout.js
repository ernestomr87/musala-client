import React from "react";
import styled from "styled-components";
import { Link, Location } from "@reach/router";
import { Layout, Menu, Breadcrumb, Typography, Row, Col } from "antd";
const { Title } = Typography;

const { Header, Content, Footer } = Layout;

const Logo = styled(Title)`
  &.ant-typography {
    color: #ffffff;
    margin: 15px 0;
  }
`;
const MenuItem = styled(Menu.Item)`
  &.ant-menu-item {
    float: right;
  }
`;

export const LayoutCmp = ({ children }) => {
  return (
    <Location>
      {({ location, navigate }) => {
        return (
          <Col
            style={{ marginTop: 40 }}
            xs={{ span: 20, offset: 2 }}
            lg={{ span: 14, offset: 5 }}
          >
            <Content className="layout">
              <Header>
                <Row>
                  <Col xs={{ span: 14 }} lg={{ span: 8 }}>
                    <Link to="/">
                      <Logo level={4}>Managing Gateways</Logo>
                    </Link>
                  </Col>
                  <Col xs={{ span: 10 }} lg={{ span: 8, offset: 8 }}>
                    <Menu
                      theme="dark"
                      mode="horizontal"
                      selectedKeys={[location.pathname]}
                      style={{ lineHeight: "64px" }}
                    >
                      <MenuItem key="/gateways">
                        <Link to="/gateways">Gateways</Link>
                      </MenuItem>
                    </Menu>
                  </Col>
                </Row>
              </Header>
              <Content style={{ padding: "0 50px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  {location.pathname === "/" && (
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                  )}
                  {location.pathname === "/gateways" && (
                    <React.Fragment>
                      <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>Gateways</Breadcrumb.Item>
                    </React.Fragment>
                  )}
                  {location.pathname !== "/gateways" &&
                    location.pathname !== "/" && (
                      <React.Fragment>
                        <Breadcrumb.Item>
                          <Link to="/">Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                          <Link to="/gateways">Gateways</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Details</Breadcrumb.Item>
                      </React.Fragment>
                    )}
                </Breadcrumb>
                <div style={{ background: "#fff", minHeight: 280 }}>
                  {children}
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Example App ©2019 Created by Me
              </Footer>
            </Content>
          </Col>
        );
      }}
    </Location>
  );
};
