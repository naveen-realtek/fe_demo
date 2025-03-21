import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,

  Select,
  Switch,
  notification,
  ConfigProvider,
  Upload,
  message,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { ZinRightArrow } from "../../images";
import { useNavigate } from "react-router-dom";
import { candidateService, authorizationService } from "../../../service";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { Currency } from "../../../shared-components/currency";
import { DateFormat } from "../../../shared-components/date-format";
import { TimeFormat } from "../../../shared-components/time-format";



export const OrganizationLocationAdd = () => {
  const [isActive, setIsActive] = useState(true);
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
  const [loading, setloading] = useState(false);

  const { Dragger } = Upload;

  // -----------------------------------------------   notification -------------------------------//

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

  // ---------------------------------------------------- Add values -------------------------------------------//

  function clientAdd(values) {
    let clientAdd = {
      unit_name: values.unit_name || "",
      time_zone: values.time_zone || "",
      time_format: values.time_format || "",
      date_format: values.date_format || "",
      currency: values.currency || "",
      phone_code: values.phone_code || "",
      phone_number: values.phone_number || "",

      email: values.email ? values.email : "",
      city: values.city ? values.city : "",
      country: values.country ? values.country : "",
      address_line1: values.address_line1 ? values.address_line1 : "",
      address_line2: values.address_line2 ? values.address_line2 : "",
      zip_code: values.zip_code ? values.zip_code : "",
      state: values.state ? values.state : "",
      status: isActive,
      schemaVersion: 1,
    };
    return clientAdd;
  }

  // -------------------------------------------------   Edit values -----------------------------------//

  const { state } = location || {};

  const location = useLocation();
  const { locationData, isEditModeStatus } = location.state || {};
  const editCient = location.state;
  const editCientEditMode =
    editCient && editCient.isEditModeStatus
      ? editCient.isEditModeStatus
      : false;

  const editCientData = editCient && editCient.state && locationData;
  console.log("editCientData", editCientData);
  console.log("editCientEditMode", editCientEditMode);
  console.log("editCient", editCient);

  useEffect(() => {
    if (editCientEditMode && editCientData) {
      form.setFieldsValue({
        unit_name: editCientData?.unit_name || "",
        time_zone: editCientData?.time_zone || "",
        time_format: editCientData?.time_format || "",
        date_format: editCientData?.date_format || "",
        zip_code: editCientData?.zip_code || "",
        phone_code: editCientData?.phone_code || "",
        phone_number: editCientData?.phone_number || "",
        currency: editCientData?.currency || "",
        email: editCientData?.email || "",
        city: editCientData?.city || "",
        country: editCientData?.country || "",
        address_line1: editCientData?.address_line1 || "",
        address_line2: editCientData?.address_line2 || "",
        state: editCientData?.state || "",
      });
    }
  }, [editCientEditMode, editCientData, form]);
  useEffect(() => {
    console.log("editCientData inside useEffect:", editCientData);
  }, [editCientData]);
  
  // ---------------------------------------------------- add & edit api ---------------------------------------//

  const onFinish = async (values) => {
    setloading(true);
    try {
      const clientAddFormData = clientAdd(values);
      let response;
      if (editCientEditMode) {
        response = await authorizationService.updatelocation(
          editCientData && editCientData.id,
          clientAddFormData
        );
        message.success(response && response.data);
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

  // --------------------------------  Time zone ---------------------------------//

  const [timezones, setTimezones] = useState([]);
  const fetchTimezones = async () => {
    setLoading(true);
    try {
      const response = await candidateService.gettimezone();
      if (response?.data?.length) {
        const formattedTimezones = response.data.map((tz) => ({
          label: tz.name, // Display text
          value: String(tz.name), // Ensure value is a string
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

  // -------------------------------------   Required ---------------------------//

  const validateMessages = {
    required: "Mandatory field",
  };

  // ------------------------------------------   phone number -------------------------------------//

  const handleChangeNumeric = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!/^[0-9]+$/.test(String.fromCharCode(charCode))) {
      e.preventDefault();
    }
  };




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
            <Link to="/app/admin/location">locations</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbsLink">
            {editCientEditMode ? "Edit location " : "Add location"}
          </Breadcrumb.Item>
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
                      <div className="col-lg-6">
                        <Form.Item
                          className="mb-3"
                          label="Contact number"
                          name={[name, "contactNumber"]}
                          required
                        >
                          <Input.Group compact>
                            <div className="d-flex align-items-center">
                              <Form.Item
                                name="phone_code"
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
                                name="phone_number"
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

                      <div className="col-lg-6">
                        <Form.Item name="address_line1" label="Address 1">
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter address 1"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-6">
                        <Form.Item name="address_line2" label="Address 2">
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
                        <Form.Item required name="zip_code" label="Zipcode">
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
                          name="time_format"
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
                          name="date_format"
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
                    {editCientEditMode ? "Update" : "Add "}
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