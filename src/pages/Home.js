import React from "react";
import { Typography } from "antd";

const { Paragraph, Title } = Typography;

export const Home = () => (
  <div>
    <Title level={4}>Description</Title>
    <Paragraph>
      This sample project is managing gateways - master devices that control
      multiple peripheral devices. Your task is to create a REST service
      (JSON/HTTP) for storing information about these gateways and their
      associated devices.
      <br />
      This information must be stored in the database. When storing a gateway,
      any field marked as “to be validated” must be validated and an error
      returned if it is invalid. Also, no more that 10 peripheral devices are
      allowed for a gateway.
      <br />
      The service must also offer an operation for displaying information about
      all stored gateways (and their devices) and an operation for displaying
      details for a single gateway. Finally, it must be possible to add and
      remove a device from a gateway.
      <br />
      <br />
      <ul>
        <strong>Each gateway has:</strong>
        <li>a unique serial number (string)</li>
        <li>human-readable name (string)</li>
        <li>IPv4 address (to be validated)</li>
        <li>multiple associated peripheral devices</li>
      </ul>
      <ul>
        <strong> Each peripheral device has:</strong>
        <li>a UID (number)</li>
        <li>vendor (string)</li>
        <li>date created</li>
        <li>status - online/offline</li>
      </ul>
    </Paragraph>
    <Title level={4}> Other considerations</Title>
    <Paragraph>
      <ul>
        <li> Provide an automated build.</li>
        <li>Provide basic unit tests.</li>
      </ul>
    </Paragraph>
  </div>
);
