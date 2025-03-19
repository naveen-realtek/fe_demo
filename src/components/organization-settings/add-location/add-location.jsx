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

import {
  ClientService,
  candidateService,
  authorizationService,
} from "../../../service";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { Currency } from "../../../shared-components/currency";
import { DateFormat } from "../../../shared-components/date-format";
import { TimeFormat } from "../../../shared-components/time-format";

export const OrganizationLocationAdd = () => {
  const [isActive, setIsActive] = useState(true);
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setloading] = useState(false);

  const [documentsFile, setDocumentsFile] = useState([]);
  const [documentsError, setDocumentsError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

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
      unit_name: values.unit_name || "",
      time_zone: values.timezone || "",
      time_format: values.timeFormat || "",
      date_format: values.dateFormat || "",
      currency: values.currency || "",

      email: values.email ? values.email : "",
      city: values.city ? values.city : "",
      country: values.country ? values.country : "",
      address_line1: values.line1 ? values.line1 : "",
      address_line2: values.line2 ? values.line2 : "",
      zip_code: values.pincode ? values.pincode : "",
      state: values.state ? values.state : "",
      status: isActive,
      schemaVersion: 1,
    };
    return clientAdd;
  }

  // function contactDetailsFormater(value) {
  //     let returnValue = [];
  //     if (value.length > 0) {
  //         for (let i = 0; i < value.length; i++) {
  //             if (value[i] != "") {
  //                 let objTemp = {
  //                     clientContactId: i,
  //                     contactNumber: value[i].contactNumber,
  //                     contactType: value[i].contactType,
  //                     countryCode: value[i].countryCode,
  //                     email: value[i].email,
  //                     firstName: value[i].firstName,
  //                     lastName: value[i].lastName,
  //                 };
  //                 returnValue.push(objTemp);
  //             }
  //         }
  //     }
  //     return returnValue;
  // }

  const clientValidate = async (values) => {
    const response = await ClientService.clientValidate(values);
    if (response && response.status == false) {
      form.setFieldsValue({
        clientName: "",
      });
      openNotification(response && response.error, "warning");
    }
  };

  const handleChangeNumeric = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!/^[0-9]+$/.test(String.fromCharCode(charCode))) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (editCientEditMode && editCientData) {
      console.log("Editing Mode Active:", editCientEditMode);
      console.log("editCientData:", editCientData);

      form.setFieldsValue({
        unit_name: editCientData?.unit_name || "",
        time_zone: editCientData?.time_zone || "",
        time_format: editCientData?.timeFormat || "",
        date_format: editCientData?.dateFormat || "",
        currency: editCientData?.currency || "",

        email: editCientData?.email || "",
        city: editCientData?.address?.city || "",
        country: editCientData?.address?.country || "",
        address_line1: editCientData?.address?.line1 || "",
        address_line2: editCientData?.address?.line2 || "",
        zip_code: editCientData?.address?.pincode || "",
        state: editCientData?.address?.state || "",
        // clientContact: editCientData?.clientContact || [],
      });
    }
  }, [editCientEditMode, editCientData, form]);

  useEffect(() => {
    candidSelectDataApi();
  }, []);

  const onFinish = async (values) => {
    setloading(true);

    const formattedValues = {
        ...values,
        time_zone: String(values.time_zone), // Ensure it's a string before submitting
      };
      console.log("Submitting:", formattedValues);
    try {
      const clientAddFormData = clientAdd(values); // Convert form values
      const clientData = new FormData();
      clientData.append("clientDetails", JSON.stringify(clientAddFormData));

      Object.keys(documentsFile).forEach((rowIndex) => {
        const fileList = documentsFile[rowIndex];
        fileList.forEach((file) => {
          clientData.append("documents", file.originFileObj);
        });
      });

      let response;
      if (editCientEditMode) {
        // ✅ Call API with correct ID
        response = await authorizationService.updatelocation(
          editCientData.id,
          clientData
        );
        message.success(response?.data || "Client updated successfully!");
      } else {
        response = await authorizationService.addlocation(clientAddFormData);
      }

      if (response && response.status === true) {
        openNotification(
          editCientEditMode ? "Client updated" : "Client added",
          "success"
        );
        navigate("/app/admin/location");
      } else {
        openNotification("Something went wrong", "error");
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

  //   ------------------   country_code --------------------//

  const [countryId, setCountryId] = useState();
  const [countryData, setCountryData] = useState([]);
  const [CountryCode, setCountryCode] = useState([]);

  const candidSelectDataApi = async () => {
    const contactCountryCode = await candidateService.getCountrycodeList();
    setCountryCode(contactCountryCode.data);

    const countrySelect = await candidateService.getCountry();

    setCountryData(countrySelect.data);
    cityAPI(countryId, stateId, cityId);
    stateAPI(countryId);
  };

  useEffect(() => {
    candidSelectDataApi();
  }, []);

  function changeCountyEmpty() {
    setCountryId();
    setStateId();
    form.setFieldsValue({
      state: undefined,
      city: undefined,
    });
  }

  useEffect(() => {
    setCountryId(form.getFieldValue("country"));
  }, []);

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

  // -----------------------------------  state ----------------------//

  const [stateId, setStateId] = useState();
  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isStateFieldDisabled, setStateFieldDisabled] = useState(true);

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

  useEffect(() => {
    setStateId(form.getFieldValue("state"));
  }, []);

  // -----------------------------  city ---------------------------------------------//

  const [cityId, setCityId] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [isCityFieldDisabled, setCityFieldDisabled] = useState(true);

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
  const [Loading, setLoading] = useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const response = await authorizationService.getlocationview(0, 10, "new"); // Fetch first 10 clients
      console.log(" Fetched Client Data:", response);
      setClientData(response.data || []);
    } catch (error) {
      console.error(" Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------  Time zone ---------------------------------//

  const [timezones, setTimezones] = useState([]);
  const fetchTimezones = async () => {
    setLoading(true);
    try {
      const response = await candidateService.gettimezone();
      if (response?.data?.length) {
        const formattedTimezones = response.data.map((tz) => ({
          label: tz.name, // Display text
          value: String(tz.sourceId), // Ensure value is a string
        }));
        setTimezones(formattedTimezones);
      }
    } catch (error) {
      console.error("Failed to fetch timezones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimezones();
  }, []);

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
          <Breadcrumb.Item
            overlay={<OverlayMenuDropdown type="Organization settings" />}
          >
            Organization Settings
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="app/admin/location">Locations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add Location</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="common-SpaceAdmin">
        <div className="zn-admin-Card  ">
          <ConfigProvider
            getPopupContainer={(triggerNode) => triggerNode?.parentNode}
          >
            <div className="zn-card admin-Layout p-3 pb-0 mb-6">
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
                <div className="zn-card-body mb-5">
                  <div className="col-lg-9">
                    <div className="row">
                      <div className="col-lg-6">
                        <Form.Item
                          label="Unit name"
                          name="unit_name"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter unit name"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item
                          name="status"
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
                          label="Email"
                          name="email"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter email"
                          />
                        </Form.Item>
                      </div>
                      {/* <div className="col-lg-6">
                        <Form.Item
                          className="mb-3"
                          label="Contact number"
                          name={[name, "contactNumber"]}
                          required
                        >
                          <Input.Group compact>
                            <div className="d-flex align-items-center">
                              <Form.Item
                                name={[name, "phone_code"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Country code is required",
                                  },
                                ]}
                                className="me-3 mb-0"
                              >
                                <Select
                                  size="large"
                                  showSearch
                                  allowClear
                                  placeholder="+1"
                                  style={{
                                    width: 120,
                                  }}
                                  filterOption={(input, option) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                >
                                  {CountryCode &&
                                    CountryCode.map((option) => (
                                      <Option
                                        key={option.countryCodeId}
                                        label={option.phoneCode}
                                        value={option.phoneCode}
                                      >
                                        {option.phoneCode}
                                      </Option>
                                    ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                name={[name, "phone_number"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Contact number is required",
                                  },
                                ]}
                                className="w-100 mb-0"
                              >
                                <Input
                                  size="large"
                                  placeholder="Enter contact number"
                                  onKeyPress={handleChangeNumeric}
                                  maxLength={10}
                                />
                              </Form.Item>
                            </div>
                          </Input.Group>
                        </Form.Item>
                      </div>
               */}
                      <div className="col-lg-6">
                        <Form.Item name="line1" label="Address 1">
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter address 1"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item name="line2" label="Address 2">
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter address 2"
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
                          validateStatus={
                            !isStateFieldDisabled ? null : "success"
                          }
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
                          validateStatus={
                            !isCityFieldDisabled ? null : "success"
                          }
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
                        <Form.Item required name="pincode" label="Zipcode">
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter zipcode"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item
                          required
                          name="time_zone"
                          label="Timezone"
                          rules={[
                            {
                              required: true,
                              message: "Please select a timezone",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder="Select timezone"
                            optionFilterProp="children"
                            loading={loading}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={timezones}
                            onChange={(value) =>
                              form.setFieldsValue({ time_zone: String(value) })
                            } // Convert to string on change
                          />
                        </Form.Item>
                      </div>

                      <div className="col-lg-6">
                        <Form.Item
                          required
                          name="timeFormat"
                          label="Time format"
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder="Select time format"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={TimeFormat}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item
                          required
                          name="dateFormat"
                          label="Date format"
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder="Select date format"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={DateFormat}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item required label="Currency" name="currency">
                          <Select
                            size="large"
                            showSearch
                            placeholder="Select currency"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={Currency}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="zn-card-footer p-3">
                  <Button
                    className="zn-fw-500 zn-fs-s me-3 zn-light-primary-color"
                    size="small"
                    type="secondary"
                  >
                    <Link to="/app/admin/location">Cancel</Link>
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
            </div>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};