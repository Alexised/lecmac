import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;

const CreateSignature = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formOptions, setFormOptions] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BASE_URL}forms`;
                const config = {
                    headers: {
                        Authorization: token,
                    },
                };
                const response = await axios.get(url, config);
                const forms = response.data.map(({ code }) => code);
                setFormOptions(forms);
            } catch (error) {
                console.error('Error fetching forms:', error);
                message.error('Failed to fetch forms');
            }
        };
        fetchForms();
    }, []);

    const onChange = async (info) => {
        const base64 = await getBase64(info.file);
        setImageBase64(base64);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    
    const onFinish = async (values) => {
        let url = `${import.meta.env.VITE_BASE_URL}signature`
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    name:values.name,
                    forms:values.forms,
                    signature: imageBase64
                }),
            });
            Swal.fire("Éxito", "¡Firma creada exitosamente!", "success");
            if (!response.ok) {
                Swal.fire("Error", "Error al crear firma valide los datos", "error");
                throw new Error('Failed to create form');
            }
        } catch (error) {
            console.error('Error creating form:', error);
            Swal.fire("Error", "Error al crear formulario valide los datos", "error");

            // Handle error
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <h1>Crear Firma</h1>
            <Form
                form={form}
                layout="vertical"
                name="create_signature"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Subir imagen de la firma"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Upload.Dragger
                        maxCount={1}
                        onChange={onChange}
                        beforeUpload={() => false}
                    >
                        <p className="ant-upload-drag-icon">
                            Arrastra y suelta la imagen aquí o haz clic
                        </p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item
                    name="forms"
                    label="Formularios asociados"
                    rules={[{ required: true, message: 'Este campo es obligatorio seleccione al menos uno' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Por favor seleccione al menos uno"
                        onChange={(value) => setSelectedForms(value)}
                    >
                        {formOptions.map((code) => (
                            <Option key={code} value={code}>
                                {code}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Crear Firma
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateSignature;
