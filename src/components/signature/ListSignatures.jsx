import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { DeleteOutlined, } from '@ant-design/icons';
import Swal from 'sweetalert2';

const ListSignatures = () => {
    const navigate = useNavigate();
    const [signatures, setSignatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const fetchSignatures = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}signature`, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token JWT a los encabezados de la solicitud
                }});
            setSignatures(response.data);
        } catch (error) {
            console.error('Error fetching signatures:', error);
            Swal.fire('Error', 'Failed to fetch signatures', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSignatures();
    }, []);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}signature/${id}`);
            Swal.fire('Success', 'Firma eliminada exitosamente', 'success');
            fetchSignatures();
        } catch (error) {
            console.error('Error deleting signature:', error);
            Swal.fire('Error', 'No se pudo eliminar la firma', 'error');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space size="middle">
                    <Link to={`/edit-signature/${record.id}`}>
                    {/* <Button type="primary" style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1C4008', borderColor: '#1C4008' }} icon={<EditOutlined />} /> */}
                    </Link>
                    <Popconfirm
                        title="¿Estás seguro de eliminar esta firma?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="SI"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <h1>Lista de Firmas</h1>
            <Table columns={columns} dataSource={signatures} loading={loading} />
            <Button style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1C4008', borderColor: '#1C4008' }} 
            type="primary" onClick={() => navigate('/signature/create')}>
            Create Firma
                </Button>
        </div>
    );
};

export default ListSignatures;