import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";

const CreateForm = () => {
  const [activitiesList, setActivitiesList] = useState([{ activity: '' }]);
  const token = localStorage.getItem('token');
  const addActivity = () => {
    setActivitiesList([...activitiesList, { activity: '' }]);
  };

  const removeActivity = (index) => {
    const updatedActivities = [...activitiesList];
    updatedActivities.splice(index, 1);
    setActivitiesList(updatedActivities);
  };

  const onFinish = async (values) => {
    let url = `${import.meta.env.VITE_BASE_URL}forms`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          name:values.name,
          code:values.code,
          activities: activitiesList
        }),
      });
      Swal.fire("Éxito", "¡Formulario creado exitosamente!", "success");

      if (!response.ok) {
        Swal.fire("Error","Error al crear formulario valide los datos","error");
        throw new Error('Failed to create form');

      }

      // Handle success
    } catch (error) {
      console.error('Error creating form:', error);
      Swal.fire("Error","Error al crear formulario valide los datos","error");

      // Handle error
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Nombre del Formulario" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Codigo del Formulario" name="code">
        <Input />
      </Form.Item>
      {activitiesList.map((activity, index) => (
        <Form.Item key={index} label={`Actividad ${index + 1}`} name={`activity${index}`} required>
          <Space style={{ display: 'flex', alignItems: 'center' }}>
            <Input.TextArea
              value={activity.activity}
              rows={4}
              style={{
                width: '1300px',
                height: '80px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
              }}
              onChange={(e) => {
                const updatedActivities = [...activitiesList];
                updatedActivities[index].activity = e.target.value;
                setActivitiesList(updatedActivities);
              }}
              className="activity-input" // Add class name for responsive styling
            />
            {activitiesList.length > 1 && (
              <Button style={{color: 'red'}}type="link" onClick={() => removeActivity(index)} icon={<MinusCircleOutlined />} />
            )}
          </Space>
        </Form.Item>
      ))}
      <Form.Item>
        <Space style={{ justifyContent: 'flex-end', marginTop: 8 }}> {/* Adjust margin as needed */}
          <Button style={{color: '#3E710C'}} type="link" onClick={addActivity} icon={<PlusOutlined />}>
            Agregar actividad
          </Button>
          <Button style={{backgroundColor: '#1C4008', borderColor: '#3E710C'}} type="primary" htmlType="submit">
            Enviar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateForm;