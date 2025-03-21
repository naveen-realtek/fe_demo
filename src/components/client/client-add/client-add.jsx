import React, { useState, useEffect, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Space,
  Select,
  Switch,
  notification,
  ConfigProvider,
  Upload,
  message,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ZinAddIcon,
  ZinDeleteIcon,
  ZinRightArrow,
  MoreIconDelete,
  ZinUploadIcon,
} from "../../images";
import { useNavigate } from "react-router-dom";
import { Country } from "../../../shared-components/country";
import { State } from "../../../shared-components/state";
import { City } from "../../../shared-components/city";
import { ClientService, candidateService } from "../../../service";
import "./index.scss";

export const ClientAdd = () => {
  const [isActive, setIsActive] = useState(true);
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [countryId, setCountryId] = useState();
  const [stateId, setStateId] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isStateFieldDisabled, setStateFieldDisabled] = useState(true);
  const [isCityFieldDisabled, setCityFieldDisabled] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [accountManagerData, setAccountManagerData] = useState([]);
  const [CountryCode, setCountryCode] = useState([]);
  const [loading, setloading] = useState(false);
  const [parseButtonEnabled, setParseButtonEnabled] = useState(false);
  // const [resume, setResume] = useState([]);
  const [documentsFile, setDocumentsFile] = useState([]);
  const [documentsError, setDocumentsError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const editCient = location.state;
  const editCientEditMode =
    editCient && editCient.isEditModeStatus
      ? editCient.isEditModeStatus
      : false;

  const editCientData = editCient && editCient.state;

  const { Dragger } = Upload;

  const onChange = (value) => {
    console.log("Selected value: ", value);
  };

  const onSearch = (value) => {
    console.log("Search input: ", value);
  };

  const openNotification = (message, type) => {
    notification[type]({
      className: "company-information-toaster",
      message: message,
      duration: 3,
      placement: "bottomLeft",
    });
  };

  const onChangeStatus = (checked) => {
    console.log(`switch to ${checked}`);
    setIsActive(checked);
  };

  function clientAdd(values) {
    let clientAdd = {
      accountingManagerId: values.accountingManagerId
        ? values.accountingManagerId
        : 0,
      address: {
        city: values.city ? values.city : "",
        country: values.country ? values.country : "",
        line1: values.line1 ? values.line1 : "",
        line2: values.line2 ? values.line2 : "",
        pincode: values.pincode ? values.pincode : "",
        state: values.city ? values.city : "",
      },

      clientContact: contactDetailsFormater(values.clientContact),

      clientDocument: values.documents
        ? values.documents.map((document) => ({
            documentName: document.DocumentName ? document.DocumentName : null,
          }))
        : [],

      clientName: values.clientName ? values.clientName : "",
      clientNameShort: values.clientNameShort ? values.clientNameShort : "",
      clientRefrenceId: values.clientRefrenceId ? values.clientRefrenceId : "",
      clientStatus: isActive,
      clientType: values.clientType ? values.clientType : "",

      federalId: values.federalId ? values.federalId : "",
      paymentTerms: values.paymentTerms ? values.paymentTerms : "",
      websiteUrl: values.websiteUrl ? values.websiteUrl : "",
      schemaVersion: 1,
    };
    return clientAdd;
  }

  function contactDetailsFormater(value) {
    let returnValue = [];
    if (value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] != "") {
          let objTemp = {
            clientContactId: i,
            contactNumber: value[i].contactNumber,
            contactType: value[i].contactType,
            countryCode: value[i].countryCode,
            email: value[i].email,
            firstName: value[i].firstName,
            lastName: value[i].lastName,
          };
          returnValue.push(objTemp);
        }
      }
    }
    return returnValue;
  }

  const clientValidate = async (values) => {
    const response = await ClientService.clientValidate(values);
    if (response.status) {
      message.success(response && response.data);
    } else {
      message.error(response && response.error);
    }
    // navigate("/app/admin/clients");
    // if (response && response.status == false) {
    //     form.setFieldsValue({
    //         clientName: "",
    //     });
    // }
  };

  const handleChangeNumeric = (e) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
    value = value.slice(0, 10); // Limit to ten characters including hyphens
    const formattedValue = formatPhoneNumber(value); // Format the phone number

    input.value = formattedValue;
  };

  const formatPhoneNumber = (phoneNumber) => {
    const formattedValue = phoneNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );
    return formattedValue;
  };

  useEffect(() => {
    if (editCientEditMode && editCientData) {
      form.setFieldsValue({
        accountingManagerId: editCientData.accountingManagerId || 0,
        city: editCientData.address?.city || null,
        country: editCientData.address?.country || null,
        line1: editCientData.address?.line1 || "",
        line2: editCientData.address?.line2 || "",
        pincode: editCientData.address?.pincode || "",
        state: editCientData.address?.state || null,
        clientContact: editCientData.clientContact || [],
        documents: editCientData.clientDocument || [],
        clientName: editCientData.clientName || "",
        clientNameShort: editCientData.clientNameShort || "",
        clientRefrenceId: editCientData.clientRefrenceId || "",
        clientType: editCientData.clientType || "Direct Client",
        federalId: editCientData.federalId || "",
        paymentTerms: editCientData.paymentTerms || "Net 10",
        websiteUrl: editCientData.websiteUrl || "",
      });
    }
  }, [editCientEditMode, editCientData]);

  useEffect(() => {
    candidSelectDataApi();
  }, []);

  const onFinish = async (values) => {
    setloading(true);
    try {
      const clientAddFormData = clientAdd(values);
      const clientData = new FormData();
      clientData.append("clientDetails", JSON.stringify(clientAddFormData));

      Object.keys(documentsFile).forEach((rowIndex) => {
        const fileList = documentsFile[rowIndex];
        fileList.forEach((file, index) => {
          clientData.append("documents", file.originFileObj);
        });
      });

      let response;
      if (editCientEditMode) {
        response = await ClientService.editClient(
          editCientData && editCientData._id,
          clientData
        );
        message.success(response && response.data);
      } else {
        response = await ClientService.addClient(clientData);
      }
   
    } catch (error) {
      console.log(error);
      message.error(
        editCientEditMode ? "Failed to update client" : "Failed to add client"
      );
    } finally {
      setloading(false);
    }
  };

  const [clientId, setClientId] = useState(null);
  const [clientDetails, setClientDetails] = useState({});

  // Get edit mode & client data from URL/state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get("EditId");

    if (editId) {
      setIsEditMode(true);
      setClientId(editId);
    }
  }, [location.search]);

  // Fetch client details if editing

  const countryChange = async (countryId, option) => {
    const selectedCountryName = option.key;
    if (!countryId) {
      changeCountyEmpty();
      setStateData([]);
      setCityData([]);
      setStateFieldDisabled(true);
      setCityFieldDisabled(true);
    } else {
      changeCountyEmpty();
      setSelectedCountry(selectedCountryName);
      stateAPI(selectedCountryName);
      setCountryId(selectedCountryName);
    }
  };

  function changeCountyEmpty() {
    setCountryId();
    setStateId();
    form.setFieldsValue({
      state: undefined,
      city: undefined,
    });
  }

  const stateChange = async (stateId, option) => {
    const selectStateName = option.key;
    if (!stateId) {
      setSelectedState(null);
      setCityFieldDisabled(true);
      setCityData([]);
    } else {
      setSelectedState(selectStateName);
      await cityAPI(countryId, selectStateName);
    }
  };

  async function stateAPI(countryId) {
    const getState = await candidateService.getState(countryId);
    if (getState.data === null) {
      setStateFieldDisabled(true);
      setStateData([]);
      setCityFieldDisabled(true);
      setCityData([]);
    } else {
      setStateData(getState.data);
      setStateFieldDisabled(false);
    }
  }

  function changeStateEmpty() {
    setStateId();
    form.setFieldsValue({
      state: undefined,
      city: undefined,
    });
  }

  async function cityAPI(countryId, stateId, cityId) {
    const getCity = await candidateService.getCity(countryId, stateId);
    if (getCity.data === null) {
      setCityFieldDisabled(true);
      setCityData([]);
    } else {
      setCityData(getCity.data);
      setCityFieldDisabled(false);
      if (cityId) {
        const city = getCity.data.find(
          (citys) => parseInt(citys.cityId) === parseInt(cityId)
        );
        form.setFieldsValue({
          city: city ? city.name : null,
        });
      }
    }
  }

  useEffect(() => {
    setCountryId(form.getFieldValue("country"));
  }, []);

  useEffect(() => {
    setStateId(form.getFieldValue("state"));
  }, []);

  const candidSelectDataApi = async () => {
    const contactCountryCode = await candidateService.getCountrycode();
    setCountryCode(contactCountryCode.data);
    const countrySelect = await candidateService.getCountry();
    setCountryData(countrySelect.data);
    const response = await ClientService.getAccountManagerList();
    setAccountManagerData(response.data);
    cityAPI(countryId, stateId, cityId);
    stateAPI(countryId);
  };

  const validateMessages = {
    required: "Mandatory field",
  };

  const documentsValidator = (_, fileList) => {
    if (fileList && fileList.length > 0) {
      setDocumentsFile(fileList);
      setDocumentsError("");
    } else {
      setDocumentsFile([]);
      setDocumentsError("Resume is required");
    }
    return Promise.resolve();
  };
  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
    }
    return isLt2M || Upload.LIST_IGNORE;
  };

  const handleFileChange = (fileList, index) => {
    setDocumentsFile((prevState) => ({
      ...prevState,
      [index]: fileList,
    }));

    fileList.forEach((file) => {
      if (file.status === "done") {
        message.success(`${file.name} file uploaded successfully.`);
      } else if (file.status === "error") {
        message.error(`${file.name} file upload failed.`);
      }
    });
  };

  const handleRemove = (fieldKey, remove, index) => {
    remove(fieldKey);
    setDocumentsFile((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const documentsProps = (index) => ({
    beforeUpload: beforeUpload,
    maxCount: 1,
    accept: ".pdf",
    onChange: ({ fileList }) => handleFileChange(fileList, index),
    fileList: documentsFile[index] || [],
    onRemove: () => {
      setDocumentsFile((prevState) => {
        const updated = { ...prevState };
        delete updated[index];
        return updated;
      });
      message.error(`File removed successfully`);
    },
  });

  const [clientData, setClientData] = useState([]);

  // const fetchClientData = async () => {
  //     setLoading(true);
  //     try {
  //         const response = await ClientService.getClient(0, 10, "new"); // Fetch first 10 clients
  //         console.log(" Fetched Client Data:", response);
  //         setClientData(response.items || []);
  //     } catch (error) {
  //         console.error(" Error fetching client data:", error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  return (
    <div className="edit-company-information">
      <div className="admin-breadcrums">
        <Breadcrumb separator={<ZinRightArrow />}>
          <Breadcrumb.Item>
            <Link to="/app/dashboard">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/app/admin">Admin</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/app/admin/clients">Clients</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbsLink">
            {editCientEditMode ? "Edit client " : "Add client"}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="admin-Layout">
        <div className="bg-white candidates-addForm">
          <ConfigProvider
            getPopupContainer={(triggerNode) => triggerNode?.parentNode}
          >
            <Form
              className="add-form"
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              layout="vertical"
              onFinish={onFinish}
              validateTrigger="onBlur"
              validateMessages={validateMessages}
              form={form}
              initialValues={{
                clientContact: [""],
                documents: [""],
              }}
            >
              <div className="add-user-Form">
                <div className="row">
                  <div className="col-lg-6">
                    <Form.Item
                      name="clientRefrenceId" // Ensure this matches the form field name
                      label="Client Id"
                      className="mb-3"
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder="Enter Id"
                        // onBlur={(e) => clientValidate(e.target.value)}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-lg-6">
                    <Form.Item
                      name="clientName" // Ensure this matches the form field name
                      label="Client organization name"
                      className="mb-3"
                      rules={[
                        { required: true },
                        {
                          min: 5,
                          message:
                            "Organization name must be at least 5 characters long!",
                        },
                        {
                          max: 30,
                          message:
                            "Organization name cannot be longer than 30 characters!",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder="Enter client organization name"
                        onBlur={(e) => clientValidate(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="federalId"
                      label="Federal ID"
                      className="mb-3"
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder="Enter federal ID"
                      />
                    </Form.Item>
                  </div>

                  <div className="col-lg-6">
                    <Form.Item name="clientType" label="Type" className="mb-3">
                      <Select
                        size="large"
                        showSearch
                        showArrow
                        allowClear
                        placeholder="Select type"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          {
                            value: "Direct Client",
                            label: "Direct Client",
                          },
                          {
                            value: "Tier 1 (or) End Client",
                            label: "Tier 1 (or) End Client",
                          },
                          {
                            value: "Implementation partner",
                            label: "Implementation partner",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="websiteUrl"
                      label="Website"
                      className="mb-3"
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder="Enter website"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="clientStatus"
                      label="Status"
                      className="mb-3"
                    >
                      <Switch
                        defaultChecked={isActive}
                        onChange={onChangeStatus}
                      />
                      <span className="switcher-label">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="line1"
                      label="Address line 1"
                      className="mb-3"
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder=" Address line 1"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="line2"
                      label="Address line 2"
                      className="mb-3"
                    >
                      <Input
                        type="text"
                        size="large"
                        placeholder="Address line 2"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item label="Country" name="country">
                      <Select
                        size="large"
                        showSearch
                        allowClear
                        placeholder="Select country"
                        onChange={countryChange}
                        value={selectedCountry}
                        onClear={changeCountyEmpty}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {countryData &&
                          countryData?.map((option) => (
                            <Option
                              key={option.countryId}
                              label={option.name}
                              value={option.name}
                            >
                              {option.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      label="State"
                      name="state"
                      validateStatus={!isStateFieldDisabled ? null : "success"}
                      help={!isStateFieldDisabled ? undefined : ""}
                    >
                      <Select
                        size="large"
                        showSearch
                        allowClear
                        placeholder="Select state"
                        onChange={stateChange}
                        value={selectedState}
                        onClear={changeStateEmpty}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        disabled={isStateFieldDisabled}
                      >
                        {stateData &&
                          stateData.map((option) => (
                            <Option
                              key={option.stateId}
                              label={option.name}
                              value={option.name}
                            >
                              {option.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      label="City"
                      name="city"
                      validateStatus={!isCityFieldDisabled ? null : "success"}
                      help={!isCityFieldDisabled ? undefined : ""}
                    >
                      <Select
                        size="large"
                        showSearch
                        allowClear
                        placeholder="Select city"
                        onClear={changeStateEmpty}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        disabled={isCityFieldDisabled}
                      >
                        {cityData &&
                          cityData.map((option) => (
                            <Option
                              key={option.cityId}
                              label={option.name}
                              value={option.name}
                            >
                              {option.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="col-lg-6">
                    <Form.Item name="pincode" label="Zip code" className="mb-3">
                      <Input
                        type="text"
                        size="large"
                        placeholder="Enter zipcode"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="paymentTerms"
                      label="Payment terms"
                      className="mb-3"
                    >
                      <Select
                        size="large"
                        showSearch
                        allowClear
                        placeholder="Select payment terms"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          {
                            value: "1",
                            label: "10",
                          },
                          {
                            value: "2",
                            label: "Net 10",
                          },
                          {
                            value: "3",
                            label: "Net 15",
                          },
                          {
                            value: "4",
                            label: "Net 30",
                          },
                          {
                            value: "5",
                            label: "Net 45",
                          },
                          {
                            value: "6",
                            label: "Net 60",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <Form.Item
                      name="accountingManagerId"
                      label="Account manager"
                      className="mb-3"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        showSearch
                        allowClear
                        placeholder="Select account manager"
                        onChange={candidSelectDataApi}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {accountManagerData &&
                          accountManagerData.map((option) => (
                            <Option
                              key={option.userId}
                              label={`${option.firstName} ${option.lastName}`}
                              value={option.userId}
                            >
                              {`${option.firstName} ${option.lastName}`}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="zn-light-text-dark-color zn-fw-500 zn-fs-m mb-1 me-3">
                    Client contact
                  </label>
                </div>
                <div>
                  <Form.List name="clientContact">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(
                          ({ key, name, fieldKey, ...restField }, index) => (
                            <Space
                              key={key}
                              direction="vertical"
                              style={{
                                width: "100%",
                              }}
                            >
                              <div className="col-lg-12  zin-addforms-inline">
                                <div className="position-relative">
                                  <div className="sideHeading-border">
                                    <span className="zn-light-text-dark-color zn-fw-500 zn-fs-xs">
                                      Contact &nbsp;
                                      {index + 1}
                                    </span>
                                  </div>
                                  {index ? (
                                    <div
                                      onClick={() => remove(name)}
                                      className="contactperson-delete cursor-pointer"
                                    >
                                      <MoreIconDelete />
                                    </div>
                                  ) : null}
                                </div>
                                <div className="row mt-4">
                                  <div className="col-lg-6">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "contactType"]}
                                      fieldKey={[fieldKey, "contactType"]}
                                      required
                                      label="Type"
                                      className="mb-3"
                                      rules={[
                                        {
                                          required: true,
                                        },
                                      ]}
                                    >
                                      <Select
                                        size="large"
                                        showSearch
                                        allowClear
                                        placeholder="Select type"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                          (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                        options={[
                                          {
                                            value: "Finance",
                                            label: "Finance",
                                          },
                                          {
                                            value: "Recruiter",
                                            label: "Recruiter",
                                          },
                                          {
                                            value: "Manager",
                                            label: "Manager",
                                          },
                                        ]}
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="col-lg-6">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "firstName"]}
                                      fieldKey={[fieldKey, "firstName"]}
                                      label="Name"
                                      className="mb-3"
                                      required
                                      rules={[
                                        {
                                          required: true,
                                        },
                                      ]}
                                    >
                                      <Input
                                        type="text"
                                        size="large"
                                        placeholder="Enter name"
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="col-lg-6">
                                    <Form.Item
                                      {...restField}
                                      className="mb-0"
                                      label="Contact number"
                                      name={[name, "contactNumber"]}
                                      required
                                    >
                                      <Input.Group compact>
                                        <div className="d-flex ">
                                          {/* Country Code Select */}
                                          <Form.Item
                                            {...restField}
                                            name={[name, "countryCode"]}
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Country code is required",
                                              },
                                            ]}
                                          >
                                            <Select
                                              size="large"
                                              showSearch
                                              allowClear
                                              placeholder="+1"
                                              style={{ width: 120 }}
                                              className="me-3"
                                              filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                  .toLowerCase()
                                                  .includes(input.toLowerCase())
                                              }
                                            >
                                              {CountryCode?.map((option) => (
                                                <Select.Option
                                                  key={option.countryCodeId}
                                                  label={option.phoneCode}
                                                  value={option.phoneCode}
                                                >
                                                  {option.phoneCode}
                                                </Select.Option>
                                              ))}
                                            </Select>
                                          </Form.Item>

                                          {/* Contact Number Input */}
                                          <Form.Item
                                            {...restField}
                                            name={[name, "contactNumber"]}
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Contact number is required",
                                              },
                                            ]}
                                            className="w-100"
                                          >
                                            <Input
                                              size="large"
                                              className="w-100"
                                              placeholder="Enter contact number"
                                              onKeyPress={handleChangeNumeric}
                                              // maxLength={10}
                                            />
                                          </Form.Item>
                                        </div>
                                      </Input.Group>
                                    </Form.Item>
                                  </div>

                                  <div className="col-lg-6">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "email"]}
                                      fieldKey={[fieldKey, "email"]}
                                      required
                                      label="Email"
                                      className="mb-3"
                                      rules={[
                                        {
                                          required: true,
                                        },
                                        {
                                          type: "email",
                                          message:
                                            "The input is not valid E-mail!",
                                        },
                                      ]}
                                    >
                                      <Input
                                        type="text"
                                        size="large"
                                        placeholder="Enter email"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </Space>
                          )
                        )}
                        <div className="col-lg-12 mt-2">
                          <Form.Item>
                            <Button
                              className="w-100 form-add-more-button"
                              type="dashed"
                              onClick={() => add()}
                              icon={"+"}
                            >
                              <span className="ms-1 form-add-more-content">
                                Add more
                              </span>
                            </Button>
                          </Form.Item>
                        </div>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>

              <div className="bg-white add-form-footer d-flex align-items-center justify-content-end gap-3">
                <Button
                  className="zn-fw-500 zn-fs-s zn-light-primary-color"
                  size="small"
                  type="secondary"
                >
                  <Link to="/app/admin/clients">Cancel</Link>
                </Button>
                <Button
                  className="zn-fw-500 zn-fs-s"
                  size="small"
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  <span>{editCientEditMode ? "Update" : "Save"}</span>
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};
