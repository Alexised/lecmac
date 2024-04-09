import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'; // Importar el ícono de "ver" desde antd
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

const ListFills = () => {
  const [forms, setForms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

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
      title: 'Código de Inspección Empresa',
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
        <Space size="middle">
          <Link to={`/show/form/${record.id}`}>
            <Button  style={{backgroundColor: '#3E710C'}} type="primary" icon={<EyeOutlined />} >Ver</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={forms} />;
};

export default ListFills;
