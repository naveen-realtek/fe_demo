import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Breadcrumb,
    Button,
    ConfigProvider,
    Form,
    Input,
    Select,
    notification,
    Upload,
} from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined, CopyOutlined } from "@ant-design/icons";
import { ZinRightArrow, Uploadicon, ZinUploadIcon } from "../../images";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";

import { TimeZone } from "../../../shared-components/time-zone";
import { TimeFormat } from "../../../shared-components/time-format";
import { DateFormat } from "../../../shared-components/date-format";
import { Currency } from "../../../shared-components/currency";
import { candidateService, authorizationService } from "../../../service";

function EditCompanyInformation() {
    const location = useLocation();
    const companyData = location.state?.companyData || {};
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (companyData) {
            form.setFieldsValue({
                city: companyData.address?.city || "",
                country: companyData.address?.country || "",
                address1: companyData.address?.line1 || "",
                address2: companyData.address?.line2 || "",
                pincode: companyData.address?.pincode || "",
                state: companyData.address?.state || "",
                companyName: companyData.company_name || "",
                contactNumber: companyData.phone_number || "",
                contactCountryCode: companyData.phone_code || "",
                companyWebsite: companyData.website || "",
                email: companyData.email || "",
                timezone: companyData.time_zone || "",
                timeFormat: companyData.time_format || "",
                dateFormat: companyData.date_format || "",
                currency: companyData.currency || "",
                logo_copy_location: companyData.logo_copy_location || "",

            });
        }
    }, [companyData, form]);

    function setFormData(values) {
        let jobsdata = {
            address: {
                city: values.city || "",
                country: values.country || "",
                line1: values.address1 || "",
                line2: values.address2 || "",
                pincode: values.pincode || "",
                state: values.state || "",
            },
            clientName: values.companyName || "",
            phone: values.contactNumber || "",
            phoneCode: values.contactCountryCode || "",
            clientStatus: true, // Always set to true
            websiteUrl: values.companyWebsite || "",
            email: values.email || "",
            company_timezone: values.timezone || "",
            company_time_format: values.timeFormat || "",
            company_date_format: values.dateFormat || "",
            company_currency: values.currency || "",
            logo_copy_location: companyData.logo_copy_location || "",
        };
        // const htmlContent = values?.jobDescription;

        return jobsdata;
    }
    const onFinish = async (values) => {
        console.log("values", values);
        setLoading(true);

        const jobsformdata = setFormData(values);
        console.log("jobsformdata", jobsformdata);

        // First, create the FormData instance
        const formData = new FormData();
        console.log("formData", formData);

        // Then append your payload to it
        formData.append("json", JSON.stringify(jobsformdata));
        // formData.append('resume', resume[0]?.originFileObj);
        // Now you can use formData in your API call
        // For example:
        const response = await authorizationService.updatecompany(
            formData,
            companyData && companyData.id
        );
        console.log("response", response);
        // ... rest of your code
    };

    const handlePhoneChange = (e) => {
        const input = e.target;
        let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
        value = value.slice(0, 10); // Limit to ten characters including hyphens
        const formattedValue = formatPhoneNumber(value); // Format the phone number

        input.value = formattedValue;
    };

    // --------------------- phone number -----------------------//

    const formatPhoneNumber = (phoneNumber) => {
        const formattedValue = phoneNumber.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
        );
        return formattedValue;
    };

    const validateMessages = {
        required: "Mandatory field",
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    //   ------------------   country_code --------------------//

    const [countryId, setCountryId] = useState();
    const [countryData, setCountryData] = useState([]);
    const [CountryCode, setCountryCode] = useState([]);

    const candidSelectDataApi = async () => {
        const contactCountryCode = await candidateService.getCountrycode();
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
                    label: tz.name, // Using "name" from your API response
                    value: tz.sourceId, // Using "sourceId" from your API response
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

    // ---------------------------------------------------------------------------- Image_Upload   ----------------------------------------------------------------//

    const [imageUrl, setImageUrl] = useState(null);
    const [imageLocation, setImageLocation] = useState(""); // Store file location

    const handleChange = (info) => {
        const file = info.file;
        const isValidSize = file.size / 1024 / 1024 < 5; // 5MB limit

        if (!isValidSize) {
            message.error("File must be smaller than 5MB!");
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result); // Convert file to Base64 preview
                setImageLocation(file.name); // Store filename as location
            };
            reader.readAsDataURL(file);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(imageLocation).then(() => {
            message.success("Logo location copied! ✅");
        });
    };




    return (
        <>
            <div className="admin-breadcrums">
                <Breadcrumb
                    className="breadcrum-dropdown"
                    separator={<ZinRightArrow />}
                >
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
                        <Link to="/app/admin/company-information">Company information</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="common-SpaceAdmin">
                <div className="zn-admin-Card  ">
                    <ConfigProvider
                        getPopupContainer={(triggerNode) => triggerNode?.parentNode}
                    >
                        <Form
                            form={form}
                            className="add-form"
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoComplete="off"
                            layout="vertical"
                            name="nest-messages"
                            validateTrigger="onBlur"
                            scrollToFirstError={true}
                            validateMessages={validateMessages}
                            onFinishFailed={onFinishFailed}
                            onFinish={onFinish}
                        >
                            <div className="zn-card-body  p-4 mb-5">
                                <div className="col-lg-9">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <Form.Item
                                                label="Company name"
                                                name="companyName"
                                                rules={[{ required: true }]}
                                            >
                                                <Input
                                                    type="text"
                                                    size="large"
                                                    placeholder="Enter company name"
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6">
                                            <Form.Item
                                                name="phone"
                                                className="mb-0"
                                                required
                                                label="Contact number"
                                            >
                                                <Input.Group compact>
                                                    <div className="d-flex">
                                                        <Form.Item
                                                            name="contactCountryCode"
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
                                                                showArrow
                                                                placeholder="Select"
                                                                style={{
                                                                    width: 120,
                                                                }}
                                                                className="me-3"
                                                                filterOption={(input, option) =>
                                                                    (option?.label ?? "")
                                                                        .toLowerCase()
                                                                        .includes(input.toLowerCase())
                                                                }
                                                            >
                                                                {CountryCode &&
                                                                    CountryCode?.map((option) => (
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
                                                            className="w-100"
                                                            name="contactNumber"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                size="large"
                                                                className="w-100"
                                                                placeholder="Enter contact number"
                                                                onKeyPress={handlePhoneChange}
                                                            // maxLength={12}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Input.Group>
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6">
                                            <Form.Item name="companyWebsite" label="Company website">
                                                <Input
                                                    type="text"
                                                    size="large"
                                                    placeholder="Enter website"
                                                />
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
                                            <Form.Item name="address1" label="Address 1">
                                                <Input
                                                    type="text"
                                                    size="large"
                                                    placeholder="Enter address 1"
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6">
                                            <Form.Item name="address2" label="Address 2">
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
                                            <Form.Item
                                                name="pincode"
                                                label="Zip code"
                                                className="mb-3"
                                            >
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
                                                name="timezone"
                                                placeholder="Select timezone"
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
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="col-lg-6">
                                            <Form.Item required name="timeFormat" label="Time format">
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
                                                    options={TimeFormat}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-lg-6">
                                            <Form.Item required name="dateFormat" label="Date format">
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
                                        <div className="col-lg-6">
                                            <label>Logo</label>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                beforeUpload={() => false}
                                                onChange={handleChange}
                                                style={{ width: "300px", height: "120px" }}
                                            >
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt="Logo" style={{ width: "100%" }} />
                                                ) : (
                                                    <div className="upload-box">
                                                        <UploadOutlined /> Upload
                                                    </div>
                                                )}
                                            </Upload>

                                            {/* Show copy button if image is uploaded */}
                                            {imageUrl && (
                                                <Button
                                                    type="primary"
                                                    icon={<ZinUploadIcon />}
                                                    onClick={copyToClipboard}
                                                    style={{ marginTop: "10px" }}
                                                >
                                                    Copy Logo Location
                                                </Button>
                                            )}

                                            {/* Display the logo_copy_location */}
                                            {imageLocation && <p>Logo Copy Location: {imageLocation}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white add-form-footer d-flex align-items-center justify-content-end gap-3">
                                <Button
                                    className="zn-fw-500 zn-fs-s zn-light-primary-color"
                                    size="small"
                                    type="secondary"
                                >
                                    <Link to="/app/admin/company-information">Cancel</Link>
                                </Button>
                                <Button
                                    className="zn-fw-500 zn-fs-s"
                                    size="small"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    <span>
                                        {companyData && companyData.company_name
                                            ? "Update"
                                            : "Save"}
                                    </span>
                                </Button>
                            </div>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
        </>
    );
}

export default EditCompanyInformation;