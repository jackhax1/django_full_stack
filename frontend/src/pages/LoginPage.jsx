import { React, useContext } from "react";
import { UserContext } from "../App";
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/login.css'

export default function LoginPage() {
  const [state, setState, isLoading, setIsLoading] = useContext(UserContext);

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }


  function login(values) {
    fetch("/backend/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({ username: values.username, password: values.password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setState(pervState => ({ ...pervState, isAuthenticated: true, username: "", password: "", error: "" }));
      })
      .catch((err) => {
        console.log(err);
        setState(pervState => ({ ...pervState, error: "Wrong username or password." }));
      });

  }
  ;

  return (
    <>

      <div className="login-container">
        <Card className="login-card">
          <div>
            <img src="logo.svg" />
          </div>
          <div>
            <img src="logo_name.svg" />
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={login}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
                { type: 'username', message: 'The input is not valid Username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="/register">register now!</a>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  )
}