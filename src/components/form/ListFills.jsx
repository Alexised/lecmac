import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'; // Importar el ícono de "ver" desde antd
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
const token = localStorage.getItem('token');
import Swal from "sweetalert2";

const ListFills = () => {
  const [forms, setForms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const roleId = userDetail.roleId;
  let url = `${import.meta.env.VITE_BASE_URL}fills`;
  useEffect(() => {
    // Cargar los formularios al montar el componente
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}fills`);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (

      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            const input = node;
            input && input.focus();
          }}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleEliminar = async(code) => {
    try {
        
        setLoading(true);
        const response = await axios.delete(`${url}/${code}`, {
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token JWT a los encabezados de la solicitud
            }});
        if (response.status === 200) {
            Swal.fire('Éxito', 'Formulario eliminado correctamente', 'success');
            fetchForms();
            // Aquí podrías realizar cualquier acción adicional, como actualizar la lista de formularios mostrados en tu interfaz
        } else {
            Swal.fire('Error', 'Error al eliminar el formulario', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar el formulario:', error);
        Swal.fire('Error', 'Error al eliminar el formulario', 'error');
    } finally {
        setLoading(false);
    }
};

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nombre de la Empresa',
      dataIndex: 'codeInspectionCompany',
      key: 'codeInspectionCompany',
      ...getColumnSearchProps('codeInspectionCompany'),
    },
    {
      title: 'Ciudad',
      dataIndex: 'city',
      key: 'city',
      ...getColumnSearchProps('city'),
    },
    {
      title: 'Código de Formulario',
      dataIndex: 'codeForm',
      key: 'codeForm',
      ...getColumnSearchProps('codeForm'),
    },
    {
      title: 'Aprobado',
      dataIndex: 'apto',
      key: 'apto',
      render: apto => (apto ? 'Si' : 'No'),
    },
    {
      title: 'Revisado por',
      dataIndex: 'reviewedBy',
      key: 'reviewedBy',
      ...getColumnSearchProps('reviewedBy'),
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <>

          <Space size="middle">
            {roleId === 1 && ( // Only show edit and delete buttons for admin (roleId === 1)
              <>
                <Popconfirm
                  title="¿Estás seguro de eliminar este registro?"
                  onConfirm={() => handleEliminar(record.id)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} style={{ color: 'red' }} />
                </Popconfirm>
              </>
            )}
          </Space>
          <Space size="middle">
            <Link to={`/show/form/${record.id}`}>
              <Button style={{ backgroundColor: '#3E710C' }} type="primary" icon={<EyeOutlined />} >Ver</Button>
            </Link>
          </Space>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={forms} />;
};

export default ListFills;
