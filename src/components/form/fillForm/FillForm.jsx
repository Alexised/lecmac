import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Typography, Checkbox, Divider, Button, Select, Upload } from 'antd'
import { Row, Col, Label } from "reactstrap";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import moment from 'moment';
import html2canvas from 'html2canvas';
import logo from "../../../assets/logo.jpg";
import jsPDF from 'jspdf';

const FillForm = ({ show }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const token = localStorage.getItem('token');
  const { code } = useParams();
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({});
  const [signatures, setSignatures] = useState([]);
  const [selectedSignature, setSelectedSignature] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageBase, setImageBase] = useState('');


  const fetchSignatures = async (code) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}signature`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSignatures(response.data.filter(signature => signature.forms.includes(code)));
    } catch (error) {
      console.error('Error fetching signatures:', error);
      Swal.fire('Error', 'Failed to fetch signatures', 'error');
    }
  };

  const options = [
    { label: 'B', value: 'B' },
    { label: 'V', value: 'V' },
    { label: 'D', value: 'D' },
    { label: 'N/A', value: 'N/A' },
  ];
  const optionsVerdict = [
    { label: 'Producto apto para ser utilizado	', value: true },
    { label: 'Producto no apto para ser utilizado		', value: false },
  ];
  const [formState, setFormState] = useState({
    codeInspectionCompany: '',
    brand: '',
    city: '',
    dateFirstUse: null,
    inspectionFrequency: '',
    fabricationDate: null,
    purchasedate: null,
    serialLotNumber: '',
    modelnumber: '',
    internalNumber: '',
    date: null,
    reviewedBy: '',
    record: '',
  });
  const handleChangeObservations = (e, index) => {
    const updatedActividades = [...activities];
    updatedActividades[index].observations = e.target.value;
    setActivities(updatedActividades);
  };

  const [selectedApto, setSelectedApto] = useState('');

  const handleChangeStatus = (e, index) => {
    const updatedSelectedOptions = [...activities];
    updatedSelectedOptions[index].status = e.target.value;
    setActivities(updatedSelectedOptions);
  };

  const handleChangeVerdict = (checkedValues) => {
    setSelectedApto([checkedValues]);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onChange = async (setImageBase, info) => {
    const base64 = await getBase64(info.file);
    setImageBase(base64);
  };


  useEffect(() => {
    fetchData();
  }, []);
  const handleChangeSignature = (value) => {
    setSelectedSignature(value);
  };

  const fetchData = async () => {

    const url = `${import.meta.env.VITE_BASE_URL}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };
    if (show === true) {
      const response = await axios.get(`${url}fills/${code}`, config);
      const data = response.data;
      setFormData({ code: data.codeForm, name: data.nameForm });
      await fetchSignatures(data.codeForm);
      setActivities(data.activities);
      form.setFieldsValue({
        codeInspectionCompany: data.codeInspectionCompany,
        brand: data.brand,
        city: data.city,
        dateFirstUse: new moment(data.dateFirstUse),
        inspectionFrequency: data.inspectionFrequency,
        fabricationDate: new moment(data.fabricationDate),
        purchasedate: new moment(data.purchasedate),
        serialLotNumber: data.serialLotNumber,
        modelnumber: data.modelnumber,
        internalNumber: data.internalNumber,
        date: new moment(data.date),
        reviewedBy: data.reviewedBy,
        record: data.record,
      });
      setImageBase64(data.imageProduct);
      setImageBase(data.imageProduct2)
      data.activities.map((activity, index) => {
        form.setFieldsValue({
          [`observations-${index}`]: activity.observations,
        });
      });
      setSelectedApto([data.apto]);
      setSelectedSignature(data.idsignature);
    } else {
      const response = await axios.get(`${url}forms/${code}`, config);
      const data = response.data;
      await fetchSignatures(data.code);
      setFormData({ code: data.code, name: data.name });
      setActivities(data.activities);
    }
  };
  const handleDownload = () => {
    const container = document.getElementById('fillFormContainer');
  
    html2canvas(container).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Tamaño A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('formulario.pdf');
    });
  };
  const onFinish = async (values) => {
    try {
      const formDataToSend = {
        brand: values.brand,
        city: values.city,
        codeInspectionCompany: values.codeInspectionCompany,
        date: values.date,
        dateFirstUse: values.dateFirstUse,
        fabricationDate: values.fabricationDate,
        inspectionFrequency: values.inspectionFrequency,
        internalNumber: values.internalNumber,
        modelnumber: values.modelnumber,
        purchasedate: values.purchasedate,
        record: values.record,
        reviewedBy: values.reviewedBy,
        serialLotNumber: values.serialLotNumber,
        codeForm: formData.code, nameForm: formData.name, apto: selectedApto[0],
        activities: activities,
        idsignature: selectedSignature,
        imageProduct: imageBase64,
        imageProduct2: imageBase,
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}fills`, formDataToSend, {
        headers: {
          Authorization: token
        }
      });
      if (response.status === 200) {
        Swal.fire("Creado", `¡Formulario creado exitosamente! ID:${response.data.id} `, "success");
      } else {
        Swal.fire("Error", "Error al crear formulario valide los ", "error");
        throw new Error('Failed to create form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire("Error", "Error al crear formulario valide los datos", "error");
    }
  };


  const handleChange = (name, value) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const isAtLeastOneCheckboxChecked = () => {
    let checked = true;
    activities.map((activity) => {
      if (activity.status == undefined) {
        checked = false;
      }
    }
    );
    if (selectedApto.length === 0) {
      checked = false;
    }
    return checked
  };
  return (
    <Form
      name="basic"
      form={form}
      onFinish={onFinish}
    >
      <div id="fillFormContainer">
      <div style={{ position: 'relative', textAlign: 'center' }}>
  <Typography.Title level={2}>CENTRO DE ENTRENAMIENTO</Typography.Title>
  <Typography.Title level={4}>{formData.name} - {formData.code}</Typography.Title>
  {show && <Typography.Title level={4}>ID: {code}</Typography.Title>}
  <div style={{ position: 'absolute', top: 0, right: 0 }}>
    <Col lg={4} xs={24}>
      <Form.Item name="imageProduct">
        <a href="https://app.lecmac.com/validate" target="_blank" rel="noopener noreferrer">
          <img key="imageProduct" src={`${logo}`} alt="Firma" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </a>
      </Form.Item>
    </Col>
  </div>
</div>
        <Row >
          <Col lg={3} xs={24}>
            <Label className="form-label">Nombre de la Empresa</Label>
            <Form.Item
              name="codeInspectionCompany"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input readOnly={show} onChange={(e) => handleChange("codeInspectionCompany", e.target.value)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Marca</Label>
            <Form.Item
              name="brand"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input readOnly={show} onChange={(e) => handleChange("brand", e.target.value)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Ciudad</Label>
            <Form.Item
              name="city"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input readOnly={show} onChange={(e) => handleChange("city", e.target.value)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Fecha de primera utilización</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="dateFirstUse"
            >
              <DatePicker disabled={show} style={{ width: "100%" }} onChange={(date) => handleChange("dateFirstUse", date)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Periodicidad de la inspección</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="inspectionFrequency"
            >
              <Input readOnly={show} onChange={(e) => handleChange("inspectionFrequency", e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row >
          <Col lg={2} xs={24}>
            <Label className="form-label">Fecha de Fabricación</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="fabricationDate"
            >
              <DatePicker disabled={show} style={{ width: "100%" }} onChange={(date) => handleChange("fabricationDate", date)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Fecha de compra</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="purchasedate"
            >
              <DatePicker disabled={show} style={{ width: "100%" }} onChange={(date) => handleChange("purchasedate", date)} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={24}>
            <Label className="form-label">Número de lote-serial</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="serialLotNumber"
            >
              <Input readOnly={show} onChange={(e) => handleChange("serialLotNumber", e.target.value)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Numero de Modelo</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="modelnumber"
            >
              <Input readOnly={show} onChange={(e) => handleChange("modelnumber", e.target.value)} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Numero Interno</Label>
            <Form.Item
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              name="internalNumber"
            >
              <Input readOnly={show} onChange={(e) => handleChange("internalNumber", e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
        <>
          {show != true && (
            <Row >
              <Col lg={6} xs={24}>
                <Label className="form-label">Imagen del objeto a certificar </Label>
                <Form.Item
                  name="image"
                  rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                  <Upload.Dragger
                    maxCount={1}
                    onChange={(e) => onChange(setImageBase64, e)}
                    beforeUpload={() => false}
                  >
                    <p className="ant-upload-drag-icon">
                      Arrastra y suelta la imagen aquí o haz clic
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
              <Col lg={6} xs={24}>
                <Label className="form-label">Imagen del objeto a certificar </Label>
                <Form.Item
                  name="image"
                  rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                  <Upload.Dragger
                    maxCount={1}
                    onChange={(e) => onChange(setImageBase, e)}
                    beforeUpload={() => false}
                  >
                    <p className="ant-upload-drag-icon">
                      Arrastra y suelta la imagen aquí o haz clic
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>

          )}
        </>

        <div style={{
          backgroundColor: '#97B858',
          width: '80%',
          margin: '0 auto',
          padding: '10px',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}
        >
          Buen status (B) status a vigilar (V) No utilizar,desechar (D) No aplicable (N/A)
        </div>
        <Row>
          <Col lg={6} xs={24}>
            <Typography.Text className="form-label">Antecedentes conocidos del producto
              Condiciones de uso o acontecimiento excepcional durante la utilización (ejemplos: caída o detención de una caída, utilización o almacenamiento a temperaturas extremas, modificación fuera de los talleres del fabricante)</Typography.Text>
          </Col>
          <Col lg={6} xs={24}>
            <Form.Item
              name="record"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <TextArea readOnly={show} rows={4} name="record" onChange={(e) => handleChange("record", e.target.value)} />
            </Form.Item>
          </Col>
          <Divider />
        </Row>
        <>
          {activities.map((actividad, index) => (
            <Row key={index}>
              <Col lg={5} xs={24}>
                <Typography.Text className="form-label">{actividad.activity}</Typography.Text>
              </Col>
              <Col lg={2} xs={24}>
                {options.map(option => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    disabled={show}
                    checked={activities[index].status === option.value}
                    onChange={(e) => handleChangeStatus(e, index)}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </Col>
              <Col lg={5} xs={24}>

                <Form.Item
                  name={`observations-${index}`}
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingrese sus observaciones.',
                    },
                  ]}
                >
                  <TextArea readOnly={show} rows={4} name="observations" placeholder="Observaciones
(detalle aquí los defectos encontrados en el producto y acciones realizadas)" onChange={(e) => handleChangeObservations(e, index)} />
                </Form.Item>
              </Col>
              <Divider />
            </Row>
          ))}
        </>
        <Row>
          <Col lg={2} xs={24}>
            {optionsVerdict.map(option => (
              <Checkbox
                key={option.value}
                value={option.value}
                disabled={show}
                checked={selectedApto.includes(option.value)}
                onChange={() => handleChangeVerdict(option.value)}
              >
                {option.label}
              </Checkbox>
            ))}
          </Col>
          <Col lg={2} xs={24}>
            <Label className="form-label">Fecha </Label>
            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <DatePicker disabled={show} style={{ width: "100%" }} onChange={(date) => handleChange("date", date)} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={24}>
            <Label className="form-label">Revisado por</Label>
            <Form.Item
              name="reviewedBy"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input readOnly={show} onChange={(e) => handleChange("reviewedBy", e.target.value)} />
            </Form.Item>
          </Col>
          {show != true && (
            <Col lg={3} xs={24}>
              <Label className="form-label">Firma</Label>
              <Form.Item
                name="signature"
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <Select onChange={handleChangeSignature} value={selectedSignature} style={{ width: '100%' }} disabled={show}>
                  {signatures.map(signature => (
                    <Option key={signature.id} value={signature.id}>{signature.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Divider />
        </Row>
        <Row>
          <Col lg={6} xs={24}>
            {(selectedSignature || show == true) && (
              <div>
                {signatures.map(signature => {
                  if (signature.id === selectedSignature) {
                    return (
                      <img key={signature.id} src={`${signature.signature}`} alt="Firma" style={{ maxWidth: '100%', maxHeight: '100px' }} />
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </Col>
          {show == true && (
            <>
              <Col lg={6} xs={24}>
                <h3>
                  puede validar el certificado en lecmac.com
                </h3>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {show == true && (
            <>
              <Col lg={2} xs={24}>
                <Label className="form-label">Imagen del Producto</Label>
                <Form.Item
                  name="imageProduct"
                >
                  <img key="imageProduct" src={`${imageBase64}`} alt="Firma" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </Form.Item>
              </Col>
              <Col lg={2} xs={24}>
                <Label className="form-label">Imagen del Producto</Label>
                <Form.Item
                  name="imageProduct"
                >
                  <img key="imageProduct2" src={`${imageBase}`} alt="Firma" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </div>
      {show !== true ? (
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1C4008', width: "20%" }} disabled={!isAtLeastOneCheckboxChecked()}>
            Guardar
          </Button>
        </Form.Item>
      ) : (
        <Button type="primary" onClick={handleDownload} style={{ marginRight: '10px' }}>
          Descargar Certificado
        </Button>
      )}
    </Form>
  );
};

export default FillForm;
