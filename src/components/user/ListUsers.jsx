import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons'; // Importar el ícono de "ver" desde antd
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
const ListUsers = () => {
  const navigate = useNavigate(); // Obtains the navigation function
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const token = localStorage.getItem('token');
  const userDetail = JSON.parse(localStorage.getItem('user'));
  const roleId = userDetail.roleId;


  useEffect(() => {
    // Cargar los usuarios al montar el componente
    fetchUsers();
  }, []);
  const handleDelete = async (id) => {

    try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}users/${id}`);
        Swal.fire('Success', 'user eliminada exitosamente', 'success');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting signature:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
    }
};
  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
            Authorization: token,
        },
    };
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}users`, config);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Rol',
      dataIndex: 'roleId',
      key: 'roleId',
      render: roleId => (roleId=== 1 ?  'Administrador' : 'Operador'),
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
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
        <h1>Lista de Usuarios</h1>
        <Table columns={columns} dataSource={users} />
        {roleId === 1 && ( 
            <Button style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1C4008', borderColor: '#1C4008' }} type="primary" 
              onClick={() => navigate('/user/create')}>
                Crear nuevo usuario
            </Button>
        )}
    </div>
  );
  };


export default ListUsers;
