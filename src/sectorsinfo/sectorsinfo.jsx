import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik, useFormik } from "formik";
import * as yup from "yup";
import useGetUsers from "../mirage/mockApiHooks/useGetUsers";
import useGetSectors from "../mirage/mockApiHooks/useGetSectors";
import { DataGrid } from "@mui/x-data-grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditIcon from "../assets/Edit.svg";
import DeleteIcon from "../assets/DeleteIcon.svg";
import "./sectorsinfo.scss";
import { toast } from "react-toastify";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const SectorsInfo = () => {
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState(false);
  const [userData, setUserData] = useState([]);
  const [data, isLoading] = useGetUsers();
  const [userSectors] = useGetSectors();
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [updateUserSectors, setUpdateUserSectors] = useState([]);
  const columns = [
    {
      field: "name",
      headerName: "User Name",
      sortable: false,
      width: 300,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "black",
              marginLeft: "25px",
              justifyContent: "flex-start",
              textTransform: "capitalize",
              fontFamily: "Manrope",
            }}
          >
            {cellValues.row.name}
          </div>
        );
      },
    },
    {
      field: "sectors",
      headerName: "Sectors Info",
      sortable: false,
      width: 300,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "black",
              fontFamily: "Manrope",
              marginLeft: "25px",
              justifyContent: "flex-start",
              textTransform: "capitalize",
            }}
          >
            {cellValues.row.sectorsName}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Users Actions",
      width: 300,
      renderCell: (cellValues) => {
        return (
          <Box
            className="renderCell-joiningDate"
            sx={{ ml: "25px", color: "black" }}
          >
            <IconButton
              onClick={(event) => handleEdit(event, cellValues.row.id)}
              aria-label="edit"
              id="edit-btn-id"
              className="edit-btn"
            >
              <img className="profile-pic" src={EditIcon} alt="profile pic" />
            </IconButton>
            <IconButton
              onClick={(event) => handleDelete(event, cellValues.row.id)}
              aria-label="delete"
              id="delete-btn-id"
              className="delete-btn"
            >
              <img className="profile-pic" src={DeleteIcon} alt="profile pic" />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  const formik = useFormik({
    initialValues: {
      name: "",
      sectorsName: [],
      agree: false,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required!"),
      sectorsName: yup
        .array()
        .min(1, "Sectors must not be empty") // Set the minimum length to 1
        .required("Sectors is required"),
      agree: yup
        .boolean()
        .oneOf([true], "You must agree to the terms and conditions")
        .required("You must agree to the terms and conditions"),
    }),
    validateOnChange: true,
    onSubmit: () => {
      if (updating) {
        updateUserForm();
      } else {
        submitUserForm();
      }
    },
  });
  const handleDelete = async (event, id) => {
    event.stopPropagation();
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUserData(userData.filter((m) => m.id !== id));
    } catch (error) {
      console.log("error is", error);
    }
  };
  const handleEdit = (event, id) => {
    event.stopPropagation();
    const user = userData.find((m) => m.id == id);
    if (!user) return;
    setUpdating(true);
    setUserId(user.id);
    formik.setFieldValue("name", user.name);
    formik.setFieldValue("sectorsName", user.sectorsName);
    formik.setFieldValue("agree", user.agree);
    setUserName(user.user_name);
    setUpdateUserSectors(user.sectorsName);
  };
  useEffect(() => {
    if (data.length > 0 && !isLoading) {
      setUserData(data);
    }
  }, [data, isLoading]);

  const submitUserForm = async () => {
    const name = formik.values.name;
    const sectorsName = formik.values.sectorsName;
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          sectorsName,
          agree,
        }),
      });
      const json = await res.json();
      setUserData([...userData, json.user]);
      toast.success("User has been Added!", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.status, {
        autoClose: 3000,
      });
    }
  };
  const updateUserForm = async () => {
    const name = formik.values.name;
    const sectorsName = formik.values.sectorsName;
    const agree = formik.values.agree;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          sectorsName,
          agree,
        }),
      });
      const json = await res.json();
      console.log("json", json?.user);
      const userCopy = [...userData];
      const index = userData.findIndex((m) => m.id === userId);
      console.log("index of ", index);
      userCopy[index] = json.user;
      setUserData(userCopy);
      setUpdating(false);
      setUserId(null);
      toast.success("Updated Successfully!", {
        autoClose: 3000, // Close the toast after 3 seconds
      });
    } catch (error) {
      toast.error(error.status, {
        autoClose: 3000, // Close the toast after 3 seconds
      });
    }
  };
  return (
    <Box className="container">
      <Typography
        className="light-text"
        fontWeight={700}
        mt={1}
        mb={2}
        fontFamily={"Manrope"}
      >
        {"Please enter name & sectors."}
      </Typography>

      <form>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="User Name"
            variant="outlined"
            margin="normal"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            style={{ width: "500px", marginBottom: "0px" }}
          />
          <Typography
            fontSize={"0.75rem"}
            fontWeight={400}
            color={"#d32f2f"}
            ml={1}
          >
            {formik.touched.name && formik.errors.name}
          </Typography>
          <FormControl
            sx={{ mt: 1, width: 500 }}
            className={error ? "error-border" : ""}
          >
            <InputLabel
              id="demo-multiple-checkbox-label"
              sx={{ color: error && "#d32f2f" }}
            >
              Add Sectors
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              name="sectorsName"
              multiple
              onChange={formik.handleChange}
              value={formik.values.sectorsName}
              input={<OutlinedInput label="Sectors" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {userSectors?.map((item) => (
                <MenuItem key={item.id} value={item.sector}>
                  <Checkbox
                    checked={
                      formik.values.sectorsName.indexOf(item.sector) > -1
                    }
                  />
                  <ListItemText primary={item.sector} />
                </MenuItem>
              ))}
            </Select>
            <Typography
              fontSize={"0.75rem"}
              fontWeight={400}
              color={"#d32f2f"}
              ml={1}
            >
              {formik.touched.sectorsName && formik.errors.sectorsName}
            </Typography>
          </FormControl>
          <Box>
            <FormControlLabel
              label="Agree to terms"
              control={
                <Checkbox
                  inputProps={{ "aria-label": "controlled" }}
                  name="agree"
                  checked={formik.values.agree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
            />
            <Typography
              fontSize={"0.75rem"}
              fontWeight={400}
              color={"#d32f2f"}
              ml={1}
            >
              {formik.touched.agree && formik.errors.agree}
            </Typography>
          </Box>
          <Stack alignItems="center" mt={3}>
            <Button
              onClick={() => {
                formik.handleSubmit();
              }}
              className="btn"
              variant="contained"
            >
              {updating ? "Update" : "Save"}
            </Button>
          </Stack>
        </Box>
      </form>
      {!isLoading && userData.length ? (
        <>
          <Box className="dataGridTable-main">
            <DataGrid
              className="dataGrid"
              rowHeight={80}
              autoHeight
              rows={[...userData]}
              columns={columns}
              disableColumnFilter
              disableSelectionOnClick
              disableColumnMenu
              disableColumnSelector
              getRowId={(row) => {
                return row?.id ? row?.id : Math.floor(Math.random() * 100);
              }}
              density="standard"
              sx={{
                "& renderCell-joiningDate MuiBox-root css-0:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#(207,207,207, 0.2)",
                  fontFamily: "Manrope",
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "14px",
                  lineHeight: "18px",
                  letterSpacing: "-0.011em",
                  cursor: "default !important",
                  color: "#6C6C6C",
                  ":focus": {
                    outline: "white",
                  },
                },
                "& .css-1jbbcbn-MuiDataGrid-columnHeaderTitle": {
                  width: "101px",
                  height: "18px",
                  fontFamily: "Manrope",
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "14px",
                  lineHeight: "18px",
                  letterSpacing: "-0.011em",
                  color: "#6C6C6C",
                  marginLeft: "20px",
                  marginTop: "16px",
                  marginBottom: "16px",
                  marginRight: "16px",
                },
                "& .MuiDataGrid-virtualScrollerRenderZone": {
                  "& .MuiDataGrid-row": {
                    backgroundColor: "white",
                  },
                },
                "& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
                "& .css-1lk0jn-MuiDataGrid-root .MuiDataGrid-columnSeparator--sideRight":
                  {
                    opacity: 0,
                  },
                "& .css-iibd7p-MuiDataGrid-root.MuiDataGrid-autoHeight": {
                  border: "white",
                },
                "& .MuiDataGrid-columnSeparator": {
                  visibility: "hidden",
                  display: "none",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "black",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#F5F5F5",
                },
                "& .MuiDataGrid-row.Mui-selected:hover, .css-vgcejw-MuiDataGrid-root .MuiDataGrid-row.Mui-selected.Mui-hovered":
                  {
                    backgroundColor: "white",
                  },
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus-within":
                  {
                    outline: "none",
                  },
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
                  {
                    outline: "none",
                  },
                "& .MuiTablePagination-root:last-child": {
                  display: "block",
                },
              }}
            />
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};

export default SectorsInfo;
