import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Button, Form, Input, Space, Select, Switch, notification, ConfigProvider, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { ZinAddIcon, ZinDeleteIcon, ZinRightArrow, MoreIconDelete, ZinUploadIcon } from '../../images';
import { useNavigate } from 'react-router-dom';
import { Country } from '../../../shared-components/country';
import { State } from '../../../shared-components/state';
import { City } from '../../../shared-components/city';
import { ClientService, candidateService } from "../../../service";
import "./client-add.scss";




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
            // clientContact: [
            //     {
            //         clientContactId: 0,
            //         contactNumber: values.contactNumber
            //             ? values.contactNumber
            //             : "",
            //         contactType: values.contactType ? values.contactType : "",
            //         countryCode: values.countryCode ? values.countryCode : "",
            //         email: values.email ? values.email : "",
            //         firstName: values.firstName ? values.firstName : "",
            //         lastName: values.lastName ? values.lastName : "",
            //     },
            // ],
            clientContact: contactDetailsFormater(values.clientContact),

            clientDocument: values.documents
                ? values.documents.map((document) => ({
                    documentName: document.DocumentName
                        ? document.DocumentName
                        : null,
                }))
                : [],

            clientOrganizationName: values.clientOrganizationName
                ? values.clientOrganizationName
                : "",
            clientOrganizationNameShort: values.clientOrganizationNameShort
                ? values.clientOrganizationNameShort
                : "",
            clientRefrenceId: values.clientRefrenceId
                ? values.clientRefrenceId
                : "",
            clientStatus: isActive,
            clientType: values.clientType ? values.clientType : "",
            // customFields: [
            //   values.city ? values.city : ""
            // ],
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

    const onFinish = async (values) => {
        setloading(true);
        try {
            const clientAddFormData = clientAdd(values);
            const clientData = new FormData();
            clientData.append(
                "clientDetails",
                JSON.stringify(clientAddFormData)
            );
            Object.keys(documentsFile).forEach((rowIndex) => {
                const fileList = documentsFile[rowIndex];
                fileList.forEach((file, index) => {
                    clientData.append(`documents`, file.originFileObj);
                });
            });
            const response = await ClientService.addClient(clientData);

            if (response && response.status === true) {
                openNotification(response && response.data, "success");
                navigate("/app/admin/clients");
                setloading(false);
            } else {
                // message.error(response.error);
                openNotification("Something went wrong", "error");
                setloading(false);
            }
        } catch (error) {
            console.log(error);
            message.error("Failed to add client");
        }
    };

    const clientValidate = async (values) => {
        const response = await ClientService.clientValidate(values);
        if (response && response.status == false) {
            form.setFieldsValue({
                clientOrganizationName: "",
            });
            openNotification(response && response.error, "warning");
        }
    };


    // // Client validation handler
    // const clientValidate = async (values) => {
    //     const response = await ClientService.clientValidate(values);
    //     // Check if validation failed
    //     if (response && response.status === false) {
    //         form.setFieldsValue({
    //             clientOrganizationName: "", // Reset the input field
    //         });
    //         openNotification(response.error, "warning"); // Show error notification
    //     }
    // };

    const handleChangeNumeric = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (!/^[0-9]+$/.test(String.fromCharCode(charCode))) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        setCountryId(form.getFieldValue("country"));
    }, []);

    useEffect(() => {
        setStateId(form.getFieldValue("state"));
    }, []);

    useEffect(() => {
        candidSelectDataApi();
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
            stateAPI(selectedCountryName);APP_PLATFORM_MASTERAPI
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

    // const handleCityChange = (countryId, option) => {
    //     const selectedCityName = option.key;
    //     cityAPI(selectedCityName);
    //     setCountryId(selectedCityName);
    // };

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

    const candidSelectDataApi = async () => {
        const contactCountryCode = await candidateService.getCountrycodeList();
        setCountryCode(contactCountryCode.data);
        // const contactCountryCodeVendor = await ClientService.getCountrycode();
        // setContactCountryCodeselect(contactCountryCodeVendor.data);
        const countrySelect = await candidateService.getCountry();
        setCountryData(countrySelect.data);
        // const response = await ClientService.getAccountManagerList();
        // setAccountManagerData(response.data);
        // cityAPI(countryId, stateId, cityId);
        // stateAPI(countryId);
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
            message.error('File must be smaller than 2MB!');
        }
        return isLt2M || Upload.LIST_IGNORE;
    };


    const handleFileChange = (fileList, index) => {
        setDocumentsFile((prevState) => ({
            ...prevState,
            [index]: fileList,
        }));

        fileList.forEach(file => {
            if (file.status === 'done') {
                message.success(`${file.name} file uploaded successfully.`);
            } else if (file.status === 'error') {
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
        accept: '.pdf',
        onChange: ({ fileList }) => handleFileChange(fileList, index),
        fileList: documentsFile[index] || [],
        onRemove: () => {
            setDocumentsFile(prevState => {
                const updated = { ...prevState };
                delete updated[index];
                return updated;
            });
            message.error(`File removed successfully`);
        },
    });






    return (
        <div className='edit-company-information'>
            <div className='admin-breadcrums'>
                <Breadcrumb separator={<ZinRightArrow />}>
                    <Breadcrumb.Item>
                        <Link to='/app/dashboard'>
                            Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/app/admin'>
                            Admin
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/app/admin/clients'>Clients</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Add New Client
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='common-SpaceAdmin'>
                <div className='zn-admin-Card  '>
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
                                                    name="clientOrganizationName" // Ensure this matches the form field name
                                                    label="Client organization name"
                                                    className="mb-3"
                                                    rules={[    
                                                        { required: true },
                                                        { min: 5, message: "Organization name must be at least 5 characters long!" },
                                                        { max: 30, message: "Organization name cannot be longer than 30 characters!" },
                                                    ]}
                                                >
                                                    <Input
                                                        type="text"
                                                        size="large"
                                                        placeholder="Enter client organization name"
                                                        onBlur={(e) => clientValidate(e.target.value)} // Call validation on blur
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
                                                <Form.Item
                                                    name="clientType"
                                                    label="Type"
                                                    className="mb-3"
                                                >
                                                    <Select
                                                        size="large"
                                                        showSearch
                                                        showArrow
                                                        allowClear
                                                        placeholder="Select type"
                                                        optionFilterProp="children"
                                                        onChange={onChange}
                                                        onSearch={onSearch}
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                        options={[
                                                            {
                                                                value: "1",
                                                                label: "Direct Client",
                                                            },
                                                            {
                                                                value: "2",
                                                                label: "Tier 1 (or) End Client",
                                                            },
                                                            {
                                                                value: "3",
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
                                                        defaultChecked={
                                                            isActive
                                                        }
                                                        onChange={
                                                            onChangeStatus
                                                        }
                                                    />
                                                    <span className="switcher-label">
                                                        {isActive
                                                            ? "Active"
                                                            : "Inactive"}
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
                                                <Form.Item
                                                    label="Country"
                                                    name="country"
                                                >
                                                    <Select
                                                        size="large"
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select country"
                                                        onChange={countryChange}
                                                        value={selectedCountry}
                                                        onClear={
                                                            changeCountyEmpty
                                                        }
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                    >
                                                        {countryData &&
                                                            countryData?.map(
                                                                (option) => (
                                                                    <Option
                                                                        key={
                                                                            option.countryId
                                                                        }
                                                                        label={
                                                                            option.name
                                                                        }
                                                                        value={
                                                                            option.name
                                                                        }
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            )}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-lg-6">
                                                <Form.Item
                                                    label="State"
                                                    name="state"
                                                    validateStatus={
                                                        !isStateFieldDisabled
                                                            ? null
                                                            : "success"
                                                    }
                                                    help={
                                                        !isStateFieldDisabled
                                                            ? undefined
                                                            : ""
                                                    }
                                                >
                                                    <Select
                                                        size="large"
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select state"
                                                        onChange={stateChange}
                                                        value={selectedState}
                                                        onClear={
                                                            changeStateEmpty
                                                        }
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                        disabled={
                                                            isStateFieldDisabled
                                                        }
                                                    >
                                                        {stateData &&
                                                            stateData.map(
                                                                (option) => (
                                                                    <Option
                                                                        key={
                                                                            option.stateId
                                                                        }
                                                                        label={
                                                                            option.name
                                                                        }
                                                                        value={
                                                                            option.name
                                                                        }
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            )}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-lg-6">
                                                <Form.Item
                                                    label="City"
                                                    name="city"
                                                    validateStatus={
                                                        !isCityFieldDisabled
                                                            ? null
                                                            : "success"
                                                    }
                                                    help={
                                                        !isCityFieldDisabled
                                                            ? undefined
                                                            : ""
                                                    }
                                                >
                                                    <Select
                                                        size="large"
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select city"
                                                        onClear={
                                                            changeStateEmpty
                                                        }
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                        disabled={
                                                            isCityFieldDisabled
                                                        }
                                                    >
                                                        {cityData &&
                                                            cityData.map(
                                                                (option) => (
                                                                    <Option
                                                                        key={
                                                                            option.cityId
                                                                        }
                                                                        label={
                                                                            option.name
                                                                        }
                                                                        value={
                                                                            option.name
                                                                        }
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            )}
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
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
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
                                                        
                                                        onChange={
                                                            candidSelectDataApi
                                                        }
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                    >
                                                        {accountManagerData &&
                                                            accountManagerData.map(
                                                                (option) => (
                                                                    <Option
                                                                        key={
                                                                            option.userId
                                                                        }
                                                                        label={`${option.firstName} ${option.lastName}`}
                                                                        value={
                                                                            option.userId
                                                                        }
                                                                    >
                                                                        {`${option.firstName} ${option.lastName}`}
                                                                    </Option>
                                                                )
                                                            )}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="zn-light-text-dark-color zn-fw-500 zn-fs-m mb-1 me-3">
                                            Client contact
                                        </label>
                                    </div>
                                    <div>
                                        <Form.List name="clientContact">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(
                                                        (
                                                            {
                                                                key,
                                                                name,
                                                                fieldKey,
                                                                ...restField
                                                            },
                                                            index
                                                        ) => (
                                                            <Space
                                                                key={key}
                                                                direction="vertical"
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div className="col-lg-9  zin-addforms-inline">
                                                                    <div className="position-relative">
                                                                        <div className="sideHeading-border">
                                                                            <span className="zn-light-text-dark-color zn-fw-500 zn-fs-xs">
                                                                                contact
                                                                                &nbsp;
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                        </div>
                                                                        {index ? (
                                                                            <div
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        name
                                                                                    )
                                                                                }
                                                                                className="contactperson-delete cursor-pointer"
                                                                            >
                                                                                <MoreIconDelete />
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <Form.Item
                                                                                {...restField}
                                                                                name={[
                                                                                    name,
                                                                                    "contactType",
                                                                                ]}
                                                                                fieldKey={[
                                                                                    fieldKey,
                                                                                    "contactType",
                                                                                ]}
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
                                                                                    filterOption={(
                                                                                        input,
                                                                                        option
                                                                                    ) =>
                                                                                        (
                                                                                            option?.label ??
                                                                                            ""
                                                                                        )
                                                                                            .toLowerCase()
                                                                                            .includes(
                                                                                                input.toLowerCase()
                                                                                            )
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
                                                                                name={[
                                                                                    name,
                                                                                    "firstName",
                                                                                ]}
                                                                                fieldKey={[
                                                                                    fieldKey,
                                                                                    "firstName",
                                                                                ]}
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
                                                                                className="mb-3"
                                                                                label="Contact number"
                                                                                name={[
                                                                                    name,
                                                                                    "contactNumber",
                                                                                ]}
                                                                                fieldKey={[
                                                                                    fieldKey,
                                                                                    "contactNumber",
                                                                                ]}
                                                                                required
                                                                            >
                                                                                <Input.Group
                                                                                    compact
                                                                                >
                                                                                    <div className="d-flex align-items-center">
                                                                                        <Form.Item
                                                                                            {...restField}
                                                                                            name={[
                                                                                                name,
                                                                                                "countryCode",
                                                                                            ]}
                                                                                            fieldKey={[
                                                                                                fieldKey,
                                                                                                "countryCode",
                                                                                            ]}
                                                                                            rules={[
                                                                                                {
                                                                                                    required: true,
                                                                                                    message:
                                                                                                        "Country code is required",
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
                                                                                                filterOption={(
                                                                                                    input,
                                                                                                    option
                                                                                                ) =>
                                                                                                    (
                                                                                                        option?.label ??
                                                                                                        ""
                                                                                                    )
                                                                                                        .toLowerCase()
                                                                                                        .includes(
                                                                                                            input.toLowerCase()
                                                                                                        )
                                                                                                }
                                                                                            >
                                                                                                {CountryCode &&
                                                                                                    CountryCode.map(
                                                                                                        (
                                                                                                            option
                                                                                                        ) => (
                                                                                                            <Option
                                                                                                                key={
                                                                                                                    option.countryCodeId
                                                                                                                }
                                                                                                                label={
                                                                                                                    option.phoneCode
                                                                                                                }
                                                                                                                value={
                                                                                                                    option.phoneCode
                                                                                                                }
                                                                                                            >
                                                                                                                {
                                                                                                                    option.phoneCode
                                                                                                                }
                                                                                                            </Option>
                                                                                                        )
                                                                                                    )}
                                                                                            </Select>
                                                                                        </Form.Item>
                                                                                        <Form.Item
                                                                                            {...restField}
                                                                                            name={[
                                                                                                name,
                                                                                                "contactNumber",
                                                                                            ]}
                                                                                            fieldKey={[
                                                                                                fieldKey,
                                                                                                "contactNumber",
                                                                                            ]}
                                                                                            rules={[
                                                                                                {
                                                                                                    required: true,
                                                                                                    message:
                                                                                                        "Contact number is required",
                                                                                                },
                                                                                            ]}
                                                                                            className="w-100 mb-0"
                                                                                        >
                                                                                            <Input
                                                                                                size="large"
                                                                                                placeholder="Enter contact number"
                                                                                                onKeyPress={
                                                                                                    handleChangeNumeric
                                                                                                }
                                                                                                maxLength={
                                                                                                    10
                                                                                                }
                                                                                            />
                                                                                        </Form.Item>
                                                                                    </div>
                                                                                </Input.Group>
                                                                            </Form.Item>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <Form.Item
                                                                                {...restField}
                                                                                name={[
                                                                                    name,
                                                                                    "email",
                                                                                ]}
                                                                                fieldKey={[
                                                                                    fieldKey,
                                                                                    "email",
                                                                                ]}
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
                                                    <div className="col-lg-9 mt-2">
                                                        <Form.Item>
                                                            <Button
                                                                className="w-100 form-add-more-button"
                                                                type="dashed"
                                                                onClick={() =>
                                                                    add()
                                                                }
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
                                    <div>
                                        <label className="zn-light-text-dark-color zn-fw-500 zn-fs-m mb-1 me-3">
                                            Documents
                                        </label>
                                    </div>
                                    <Form.List name="documents">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <div className="row">
                                                    {fields.map(
                                                        (field, index) => (
                                                            <div
                                                                className="col-lg-9"
                                                                key={field.key}
                                                            >
                                                                <div
                                                                    className="zin-addforms-inline"
                                                                    id={
                                                                        field.name
                                                                    }
                                                                >
                                                                    <div className="position-relative">
                                                                        <div className="sideHeading-border">
                                                                            <span className="zn-light-text-dark-color zn-fw-500 zn-fs-xs">
                                                                                Documents
                                                                                &nbsp;
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                        </div>
                                                                        <div
                                                                            onClick={() =>
                                                                                handleRemove(
                                                                                    field.name,
                                                                                    remove,
                                                                                    field.key
                                                                                )
                                                                            }
                                                                            className="contactperson-delete cursor-pointer"
                                                                        >
                                                                            <div>
                                                                                <MoreIconDelete />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row p-3">
                                                                        <div className="col-lg-6">
                                                                            <Form.Item
                                                                                label="Document name"
                                                                                name={[
                                                                                    field.name,
                                                                                    "DocumentName",
                                                                                ]}
                                                                                rules={[
                                                                                    {
                                                                                        required: false,
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Input
                                                                                    size="large"
                                                                                    placeholder="Enter document name"
                                                                                />
                                                                            </Form.Item>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <Form.Item
                                                                                getValueFromEvent={(
                                                                                    e
                                                                                ) =>
                                                                                    e.file
                                                                                }
                                                                                label="Upload"
                                                                                name={[
                                                                                    field.name,
                                                                                    "documents",
                                                                                ]}
                                                                                rules={[
                                                                                    {
                                                                                        required: false,
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Upload.Dragger
                                                                                    {...documentsProps(
                                                                                        field.key, index
                                                                                    )}
                                                                                >
                                                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                                                        <div className="ant-upload-drag-icon text-center">
                                                                                            <ZinUploadIcon />
                                                                                        </div>
                                                                                        <div className="mb-0">
                                                                                            Upload
                                                                                            document
                                                                                        </div>add
                                                                                    </div>
                                                                                </Upload.Dragger>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <div className="col-lg-9">
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

                                <div className="zn-card-footer p-3">
                                    <Button
                                        className="zn-fw-500 zn-fs-s me-3 zn-light-primary-color"
                                        size="small"
                                        type="secondary"
                                    >
                                        <Link to="/clients">Cancel</Link>
                                    </Button>
                                    <Button
                                        className="zn-fw-500 zn-fs-s"
                                        size="small"
                                        type="primary"
                                        loading={loading}
                                        htmlType="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}
