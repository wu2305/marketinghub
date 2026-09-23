import { Button, Link, Select, StatusBadge, TextArea, TextInput, buttonVariants, controlSizes } from "./atoms.jsx";

export default {
  title: "Atoms",
  tags: ["autodocs"],
};

export const Primary = {
  name: "Button",
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    children: "Create Campaign Task",
  },
  argTypes: {
    variant: { control: "select", options: buttonVariants },
    size: { control: "inline-radio", options: controlSizes },
    disabled: { control: "boolean" },
    children: { control: "text" },
    onClick: { action: "onClick" },
  },
  render: (args) => <Button {...args} />,
};

export const TextLink = {
  name: "Link",
  args: { href: "/reports", children: "Explore full AI Interpreter" },
  argTypes: {
    href: { control: "text" },
    children: { control: "text" },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => <Link {...args} />,
};

export const Input = {
  name: "Text input",
  args: {
    label: "Search dashboards",
    placeholder: "Search dashboards",
    value: "",
    size: "lg",
    disabled: false,
    invalid: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: controlSizes },
    onChange: { action: "onChange" },
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <TextInput {...args} />
    </div>
  ),
};

export const Area = {
  name: "Text area",
  args: {
    label: "Description",
    placeholder: "Explain the meaning, usage, and boundary of this term.",
    value: "",
    rows: 4,
    invalid: false,
    disabled: false,
  },
  argTypes: { onChange: { action: "onChange" } },
  render: (args) => (
    <div style={{ width: 480 }}>
      <TextArea {...args} />
    </div>
  ),
};

export const Dropdown = {
  name: "Select",
  args: {
    label: "Term type",
    value: "Business Term",
    placeholder: "Select a type",
    options: ["Business Term", "Global Synonym"],
    disabled: false,
    invalid: false,
  },
  argTypes: { onChange: { action: "onChange" } },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Select {...args} />
    </div>
  ),
};

export const Badge = {
  name: "Status badge",
  args: { status: "Published", children: "Published", outline: false },
  argTypes: {
    status: {
      control: "select",
      options: ["Published", "Draft", "Under Review", "Pending", "Success", "Paused"],
    },
    children: { control: "text" },
  },
  render: (args) => <StatusBadge {...args} />,
};
