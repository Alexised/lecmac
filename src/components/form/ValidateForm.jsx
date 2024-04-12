
import React, { useState } from 'react';
import axios from 'axios';
import logo from "../../assets/logo.jpg";
import Swal from "sweetalert2";
import {
  styled,
  Paper,
  Stack,
  Step,
  Stepper,
  Typography,
  IconButton,
  InputBase,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search";
const ValidateForm = () => {
  const [id, setId] = useState('');
  const [formData, setFormData] = useState(null);
  let url = `${import.meta.env.VITE_BASE_URL}fills`;
  const handleSearch = () => {
    axios.get(`${url}/${id}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        setFormData(null);
        Swal.fire('Error', 'el id no se encuentra en nuestro sistema', 'error');
      });
  };
  const getAptoColor = () => {
    if (formData && formData.apto) {
      return 'green'; // Verde si apto es true
    } else {
      return 'red'; // Rojo si apto es false o no hay datos
    }
  };
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}
    >
      <h1 style={{ color: "black", textAlign: "center" }}>Busca por ticket</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
        }}
      >
        <img src={logo} alt="Logo" width="10%" height="10%" />
        <Paper
          component="form"
          sx={{
            display: "flex",
            width: 400,
            height: 50,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar por id"
            inputProps={{ "aria-label": "Buscar por id" }}
            onChange={(e) => setId(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <div>

        </div>
      </div>

      {formData !== null && (
        <>
          <Typography
            sx={{
              fontSize: 34,
              p: "-40px 4px",
              display: "flex",
              alignItems: "center",
              width: 600,
              margin: "auto",
            }}
            color="text.secondary"
            gutterBottom
          >
            Informacion sobre el ticket: {id}
          </Typography>
          <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={4}>
          </Stack>
          <Card sx={{ maxWidth: "100%", marginTop: "20px" }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 }} color="text.secondary">
                  empresa:{formData.codeInspectionCompany}
                </Typography>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 }} color="text.secondary">
                  ciudad: {formData.city}
                </Typography>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 }} color="text.secondary">
                  fecha de certificacion : {new Date(formData.date).toLocaleString('co-ES', { timeZone: 'UTC' })}
                </Typography>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 }} color="text.secondary">
                  Periodicidad de la inspección
                  : {formData.inspectionFrequency}
                </Typography>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 }} color="text.secondary">
                  tipo de inspección : {formData.nameForm} - {formData.codeForm}
                </Typography>

              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 24 , color: getAptoColor()}}>
                  aprobado :{formData.apto ? 'Sí' : 'No'}
                </Typography>

              </div>
            </CardContent>
          </Card>
        </>
      )}

    </div>
  );
};

export default ValidateForm;