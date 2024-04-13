import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;

const CreateUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BASE_URL}`;
      let body=values
      if (values.roleId === 1) {
        url += 'users'
      }
      else {
        url += 'customers'
        body={
          name: values.name,
          lastName: values.lastName,
          user: {
            email: values.email,
            roleId: values.roleId,
            password: values.password
          }
        }
      }
        const response = await axios.post(url, body);
        if (!response) {
          throw new Error('Failed to create user');
        }
        Swal.fire("Creado", "Usuario creado", "success");
        setLoading(false);
      } catch (error) {
        console.error('Error creating user:', error);
        Swal.fire("Error", "Error al crear usuario", "error");
        setLoading(false);
      }
    };

    return (
      <div>
        <h1>            Crear Usuario</h1>
        <Form
          form={form}
          layout="vertical"
          name="create_user"
          onFinish={onFinish}
        >
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select
              placeholder="Please select a role"
              onChange={handleRoleChange}
            >
              <Option value={1}>Administrador</Option>
              <Option value={2}>operador</Option>
            </Select>
          </Form.Item>
          <>
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Input.Password />
            </Form.Item>
          </>

          {selectedRole === 2 && (
            <>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: 'This field is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Apellido"
                rules={[{ required: true, message: 'This field is required' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1C4008', borderColor: '#1C4008' }} htmlType="submit" loading={loading}>
              Crear Usuario
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  export default CreateUser;
