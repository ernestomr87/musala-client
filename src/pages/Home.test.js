import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";

import { Home } from "./Home";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Home />, div);
});

it("renders <strong> text", () => {
  const wrapper = shallow(<Home />);
  const welcome = <strong>Each gateway has:</strong>;
  // expect(wrapper.contains(welcome)).toBe(true);
  expect(wrapper.contains(welcome)).toEqual(true);
});
