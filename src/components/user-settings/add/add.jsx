import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  message,
  Switch,
  Modal,
  Upload,
} from "antd";
import {
  DeleteOutlined,
} from "@ant-design/icons";
import { authorizationService, candidateService } from "../../../service";
import { ZinRightArrow, ZinUploadIcon } from "../../images";
import "./index.scss";

export default function UserSettingAdd() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [reportingUserData, setReportingUserData] = useState([]);
  const [isAssignToDisabled, setIsAssignToDisabled] = useState(true);
  const [roleListData, setroleListData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState("");
  const location = useLocation();
  const [countryCodes, setCountryCodes] = useState([]);
  const [userID, setUserID] = useState(null);
  const userId = new URLSearchParams(location.search).get("userId");
  const [password, setPassword] = useState("")
  const [teamListData, setTeamListData] = useState([
    { value: "1", label: "Team 1" },
    { value: "2", label: "Team 2" },
    { value: "3", label: "Team 3" },
    { value: "4", label: "Team 4" },
  ]);

  useEffect(() => {
    getCountryCode();
    getUserRoles();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }

  }, [userId]);

  const getCountryCode = async () => {
    try {
      const response = await candidateService.getCountrycode();
      if (Array.isArray(response?.data) && response.data.length) {
        setCountryCodes([...response.data]); // Force state update
      } else {
        console.warn("No country codes available.");
      }
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await authorizationService.getUserDetailedView(userId);
      setUserID(response.data.userId);

      if (response.status) {
        setIsEditMode(true);
        setUserData(response.data);

        form.setFieldsValue({
          location: response.data.location,
          first_name: response.data.firstName,
          last_name: response.data.lastName,
          user_name: response.data.userName,
          name_title: response.data.nameTitle,
          email: response.data.email,
          role_id: response.data.roleId,
          team_id: response.data.teamId,
          user_pwd: response.data.user_pwd,
          reporting_id: response.data.reportingId,
          phone_extension: response.data.phoneExtension,
          mobile_number: response.data.phoneNumber,
        });
        const userListResponse = await authorizationService.getUsers(response.data.roleId);
        setReportingUserData(userListResponse.data);
        setIsActive(response.data.status === "1");
        if (response.data.roleId) {
          setIsAssignToDisabled(false);
        }
        else {
          setIsAssignToDisabled(true);
        }
      } else {
        console.error("Unexpected API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onChange = async (value) => {
    await userDataApi(value);
    setIsAssignToDisabled(false);
  };

  const userDataApi = async (id) => {
    try {
      setReportingUserData([]); // Clear first
      const userListResponse = await authorizationService.getUsers(id);
      setReportingUserData(userListResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleStatus = (checked) => {
    setIsActive(checked);
  };

  function setFormData(values) {
    let addUserForm = {
      first_name: values.first_name,
      last_name: values.last_name,
      user_name: values.user_name,
      name_title: values.name_title,
      email: values.email,
      status: values.status === true ? "1" : "0",
      role_id: values.role_id,
      location: values.location,
      reporting_id: values.reporting_id,
      phone_number: values.mobile_number,
      phone_extension: values.phone_extension,
      user_pwd: password && password
    };
    return addUserForm;
  }

  const userOnFinish = async (values) => {
    const data = setFormData(values);
    const formData = new FormData();
    formData.append("json", JSON.stringify(data));
    if (file) {
      formData.append("photo", file);
    }
    setIsLoading(true);
    try {
      const response = isEditMode
        ? await authorizationService.updateUser(userID, formData)
        : await authorizationService.createUser(formData);

      if (response.status) {
        message.success(
          isEditMode ? "User updated successfully" : "User created successfully"
        );
        navigate("/app/admin/usersettings/user", {
          state: { userDetails: userData },
        });
      } else {
        message.error(response?.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRoles = async (id) => {
    const roleListResponse = await authorizationService.getRoleList(id);
    setroleListData(roleListResponse.data);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview("");
  };

  const validateName = (_, value) => {
    if (!value) return Promise.reject("Mandatory field");
    if (value.length < 2)
      return Promise.reject("Must be at least 2 characters");
    if (!/^[A-Za-z\s]+$/.test(value))
      return Promise.reject("Only letters and spaces are allowed");
    return Promise.resolve();
  };

  const preventNumberInput = (e) => {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNameChange = (e, fieldName) => {
    let value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    form.setFieldsValue({ [fieldName]: value });
  };

  // const formatPhoneNumber = (e) => {
  //   let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
  //   if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits

  //   if (value.length > 6) {
  //     value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  //   } else if (value.length > 3) {
  //     value = `${value.slice(0, 3)}-${value.slice(3)}`;
  //   }
  //   form.setFieldsValue({ mobile_number: value }); // Update form field
  // };

  const validatePhoneNumber = (_, value) => {
    if (!value) return Promise.reject("Enter phone number");
    if (!/^\d{3}-\d{3}-\d{4}$/.test(value))
      return Promise.reject("Format: XXX-XXX-XXXX");
    return Promise.resolve();
  };

  const validateUsername = async (_, value) => {
    if (!value) return Promise.reject("Mandatory field");
    if (value.length < 2)
      return Promise.reject("Must be at least 2 characters");

    // const response = await fetch(`/api/check-username?username=${value}`);
    // const data = await response.json();
    // if (!data.isUnique) return Promise.reject("Username already exists");

    return Promise.resolve();
  };

  const handleAddRoleClick = () => {
    setOpenModal(true);
  };

  const handleSaveRole = async () => {
    if (!newRole.trim()) {
      message.error("Role name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/auth/create-role", {
        role_name: newRole,
      });
      if (response.status === 201 || response.status === 202) {
        const addedRole = response.data;
        setRoleListData([...roleListData, addedRole]);
        message.success("Role added successfully");
        setNewRole("");
        setOpenModal(false);
      } else {
        message.error("Failed to add role");
      }
    } catch (error) {
      message.error("Error adding role");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamClick = () => {
    setOpenTeamModal(true);
  };

  // Save new team
  const handleSaveTeam = async () => {
    if (!newTeam.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("/teams/add", { team_name: newTeam });

      if (response.status === 201 || response.status === 202) {
        setTeamListData([
          ...teamListData,
          { value: response.data.team_id, label: newTeam },
        ]);
        setNewTeam("");
        setOpenTeamModal(false);
      }
    } catch (error) {
      console.error("Error adding team:", error);
    } finally {
      setLoading(false);
    }
  };
  // allow only numbers.......................//
  const handleChangeNumeric = (e) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    value = value.slice(0, 10); // Limit to ten characters including hyphens
    const formattedValue = formatPhoneNumber(value); // Format the phone number

    input.value = formattedValue;
  };

  const formatPhoneNumber = (phoneNumber) => {
    const formattedValue = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formattedValue;
  };
  const validateMessages = {
    required: 'Mandatory field.'
  };

  const onChangeSwitch = (checked) => {
    setIsActive(checked);
    form.setFieldsValue({ status: checked }); // Update form field value
  };
  return (
    <>
      <div className="admin-breadcrums">
        <div className="admin-breadcrumbs">
          <Breadcrumb separator={<ZinRightArrow />}>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/dashboard">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/admin">Admin</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/admin/usersettings/user">User settings</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/admin/usersettings/user">User</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">
              {isEditMode ? "Edit User" : "Add User"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="admin-Layout">
        <div className="bg-white candidates-addForm">
          <Form
            className="add-form"
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            layout="vertical"
            onFinishFailed={onFinishFailed}
            form={form}
            onFinish={userOnFinish}
            validateMessages={validateMessages}
            scrollToFirstError={true}
            initialValues={{
              status: true,
              phone_extension: "+1"
            }}
          >
            <div className="add-user-Form">
              <div className="row">
                <div className="col-lg-6">
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true }]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter location" />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    label="Status"
                    name="status"
                    valuePropName="checked"
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Switch
                        checked={isActive}
                        onChange={onChangeSwitch}
                      />
                      <span>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    label="First name"
                    required
                    className='mb-0'
                  >
                    <Input.Group compact
                    >
                      <div className="d-flex">
                        <Form.Item
                          name="name_title"
                          rules={[
                            {
                              required: true
                            }
                          ]}
                        >
                          <Select
                            size="large"
                            className="Firstname-select me-3"
                            style={{
                              width: 120,
                            }}
                            placeholder="Mr"
                          >
                            <Select.Option value="Mr">Mr</Select.Option>
                            <Select.Option value="Mrs">Mrs</Select.Option>
                            <Select.Option value="Ms">Ms</Select.Option>
                            <Select.Option value="Dr">Dr</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="first_name"
                          rules={[
                            {
                              required: true
                            },
                            {
                              min: 2,
                              message: "First name must be at least 3 characters long"
                            }
                          ]}
                          className="w-100"
                        >
                          <Input
                            size="large"
                            placeholder="Enter first name"
                            onKeyPress={preventNumberInput}
                            onChange={(e) => handleNameChange(e, "firstName")}
                          />
                        </Form.Item>
                      </div>
                    </Input.Group>
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    className='mb-0'
                    name="last_name"
                    label="Last name"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        min: 2,
                        message: "Last name must be at least 3 characters long"
                      }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter last name"
                      onKeyPress={preventNumberInput}
                      onChange={(e) => handleNameChange(e, "zinnext_last_name")}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    name="user_name"
                    label="User name"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        min: 2
                      }
                    ]}
                  >
                    <Input size="large" placeholder="Enter user name" />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    className='mb-0'
                    label="Contact number"
                    name="phone"
                    required
                  >
                    <Input.Group compact
                    >
                      <div className="d-flex">
                        <Form.Item
                          name='phone_extension'
                          rules={[{
                            required: true,
                          }]}
                        >
                          <Select
                            size='large'
                            showSearch
                            allowClear
                            placeholder='Select country code'
                            style={{
                              width: 120,
                            }}
                            className='me-3'
                            defaultValue="+1"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            {countryCodes && countryCodes.map((option) => (
                              <Select.Option key={option.countryCodeId} label={option.phoneCode} value={option.phoneCode}>
                                {option.phoneCode}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className='w-100'
                          name='mobile_number'
                          rules={[{
                            required: true,
                          }]}>
                          <Input
                            size="large"
                            className="w-100"
                            placeholder='Enter contact number'
                            onKeyPress={handleChangeNumeric}
                          />
                        </Form.Item>
                      </div>
                    </Input.Group>
                  </Form.Item>
                </div>

                <div className="col-lg-6">
                  <Form.Item
                    name="email"
                    label="Email"
                    required
                    rules={[
                      {
                        required: true,
                        type: "email",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter email" />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    label="Password"
                    name="user_pwd"
                    rules={[
                      {
                        required: true,
                        message: ' ',
                      },
                      {
                        pattern: new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=></?*)(~!])(?=.*[A-Z]).{8,}/),
                        message: "Must be 8+ chars with uppercase, lowercase, number & special char.",
                      },
                    ]}
                  >
                    <Input.Password
                      autoComplete="off"
                      formNoValidate
                      placeholder="Create new password" 
                      size="large" 
                      onChange={e => setPassword(e.target.value)} />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item
                    label="User role"
                    name="role_id"
                    rules={[{ required: true }]}
                  >
                    <Select
                      size="large"
                      allowClear
                      showSearch
                      showArrow
                      placeholder="Select role"
                      filterOption={(input, option) =>
                        option?.label && typeof option.label === "string"
                          ? option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
                          : false
                      }
                      onChange={onChange}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div
                            style={{
                              position: "sticky",
                              bottom: 0,
                              padding: "8px",
                              textAlign: "center",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            <Button type="link" onClick={handleAddRoleClick}>
                              + Add New Role
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {roleListData.map((option) => (
                        <Select.Option
                          key={option.role_id}
                          label={option.role_name}
                          value={option.role_id}
                        >
                          {option.role_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Modal
                    open={openModal}
                    title="Add New Role"
                    centered
                    onCancel={() => setOpenModal(false)}
                    footer={null}
                  >
                    <Form layout="vertical">
                      <Form.Item label="Role Name">
                        <Input
                          type="text"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          size="large"
                          placeholder="Enter role name"
                        />
                      </Form.Item>
                      <div className="on-submitaddnewrole gap-2 margin-top-20">
                        <Button
                          type="default"
                          onClick={() => setOpenModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          loading={loading}
                          onClick={handleSaveRole}
                        >
                          Save
                        </Button>
                      </div>
                    </Form>
                  </Modal>
                </div>
                <div className="col-lg-6">
                  <Form.Item label="Team" name="zinnext_team_id">
                    <Select
                      size="large"
                      allowClear
                      showSearch
                      showArrow
                      placeholder="Select team"
                      filterOption={(input, option) =>
                        option?.label && typeof option.label === "string"
                          ? option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
                          : false
                      }
                      onChange={onChange}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div
                            style={{
                              position: "sticky",
                              bottom: 0,
                              padding: "8px",
                              textAlign: "center",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            <Button type="link" onClick={handleAddTeamClick}>
                              + Add New Team
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {teamListData.map((team) => (
                        <Select.Option key={team.value} value={team.value}>
                          {team.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Modal for Adding New Team */}
                  <Modal
                    open={openTeamModal}
                    title="Add New Team"
                    centered
                    onCancel={() => setOpenTeamModal(false)}
                    footer={null}
                  >
                    <Form layout="vertical">
                      <Form.Item label="Team Name">
                        <Input
                          type="text"
                          value={newTeam}
                          onChange={(e) => setNewTeam(e.target.value)}
                          size="large"
                          placeholder="Enter team name"
                        />
                      </Form.Item>
                      <div className="on-submitaddnewrole gap-2 margin-top-20">
                        <Button
                          type="default"
                          onClick={() => setOpenTeamModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          loading={loading}
                          onClick={handleSaveTeam}
                        >
                          Save
                        </Button>
                      </div>
                    </Form>
                  </Modal>
                </div>

                <div className="col-lg-6">
                  <Form.Item label="Reporting person" name="reporting_id">
                    <Select
                      size="large"
                      allowClear
                      placeholder="Select reporting person"
                      filterOption={(input, opt) =>
                        (opt?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      disabled={isAssignToDisabled}
                    >
                      {reportingUserData &&
                        reportingUserData.map((opt) => (
                          <Select.Option
                            key={opt.userId}
                            label={
                              opt.firstName +
                              " " +
                              opt.lastName +
                              " - " +
                              opt.roleName
                            }
                            value={opt.userId}
                          >
                            {opt.firstName +
                              " " +
                              opt.lastName +
                              " - " +
                              opt.roleName}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-lg-6">
                  <Form.Item label="Photo" name="photo">
                    <div className="custom-upload-wrapper w-100">
                      <Upload.Dragger
                        beforeUpload={(file) => {
                          setFile(file);
                          setFileName(file.name);
                          return false; // Prevent automatic upload
                        }}
                        showUploadList={false}
                        accept="image/*"
                        disabled={!!file} // Disable when file is selected
                        className="custom-dragger"
                      >
                        <div>
                          <span>
                            <ZinUploadIcon />
                          </span>
                          <span className="ms-2">Click or drag a file to upload your profile picture for login</span>
                        </div>

                      </Upload.Dragger>

                    </div>
                  </Form.Item>
                </div>
                <div className="col-lg-6 d-flex">
                  {file && (
                    <div className="upload-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Profile Preview"
                        className="preview-image"
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveFile}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white add-form-footer d-flex align-items-center justify-content-end gap-3">
              <Button type="secondary" size="small">
                <Link to="/app/admin/usersettings/user">Cancel</Link>
              </Button>
              <Button
                disabled={isLoading}
                loading={isLoading}
                type="primary"
                size="small"
                htmlType="submit"
              // onClick={handleSubmit}
              >
                <span>{isEditMode ? "Update" : "Save"}</span>
              </Button>
            </div>
          </Form>
        </div >
      </div >
    </>
  );
}
