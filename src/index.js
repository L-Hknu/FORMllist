import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Form, InputNumber, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const MyFormList = ({ form, initialValue, ...props }) => {
  React.useEffect(() => {
    form.setFields([
      {
        name: props.name,
        value: initialValue
      }
    ]);
  }, []);

  return <Form.List {...props} />;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
};

const DynamicFieldSet = () => {
  const [form] = Form.useForm();
  const [init, setInit] = useState({
    id: "2",
    names: [{ begin: 0, end: 1 }]
  });
  const onFinish = values => {
    console.log("Received values of form:", values);
  };
  React.useEffect(() => {
    console.log("init", init);
    form.validateFields();
  }, [init]);
  function setNames(type, index) {
    const initData = JSON.parse(JSON.stringify(init));
    const { names } = initData;
    if (type === "add") {
      names.push({ begin: 0, end: 0 });
    } else {
      index !== undefined && names.splice(index, 1);
    }
    initData.names = names;
    console.log("initData", initData);

    setInit({ ...initData });
  }
  function onChangeNames(v, i, type) {
    const initData = JSON.parse(JSON.stringify(init));
    initData.names[i][type] = v;
    setInit({ ...initData });
  }
  return (
    <div>
      <div>{init.id}</div>
      <Form
        form={form}
        key={new Date()}
        name="dynamic_form_item"
        {...formItemLayoutWithOutLabel}
        onFinish={onFinish}
        initialValue={init}
        onFieldsChange={(changedFields, allFields) => console.log(allFields)}
      >
        <MyFormList form={form} name="names" initialValue={init.names}>
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => {
                  const max = init.names[field.name].end,
                    min = init.names[field.name].begin;
                  console.log(field);
                  return (
                    <Form.Item
                      {...(index === 0
                        ? formItemLayout
                        : formItemLayoutWithOutLabel)}
                      label={index === 0 ? "Passengers" : ""}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        noStyle
                        name={[field.name, "begin"]}
                        rules={[
                          { required: true, message: "起始不能为空" },
                          {
                            max,
                            type: "number",
                            message: "起始值不能大于结束值"
                          },
                          { min: 0, type: "number", message: "请输入≥0的值" }
                        ]}
                      >
                        <InputNumber
                          placeholder="passenger name"
                          style={{ width: "60%" }}
                          onChange={v => onChangeNames(v, index, "begin")}
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[field.name, "end"]}
                        rules={[
                          { required: true, message: "结束不能为空" },
                          {
                            min,
                            type: "number",
                            message: "结束值不能小于起始值"
                          },
                          { min: 0, type: "number", message: "请输入≥0的值" }
                        ]}
                      >
                        <InputNumber
                          noStyle
                          placeholder="passenger name"
                          style={{ width: "60%" }}
                          onChange={v => onChangeNames(v, index, "end")}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: "0 8px" }}
                          onClick={() => {
                            setNames("remove", index);
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setNames("add");
                      // add();
                    }}
                    style={{ width: "60%" }}
                  >
                    <PlusOutlined /> Add field
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </MyFormList>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

ReactDOM.render(<DynamicFieldSet />, document.getElementById("container"));
