import {
  Breadcrumb,
  Button,
  Form,
  Select,
  Input,
  Checkbox,
  ConfigProvider,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { rolesService } from "../../../service";
import { ZinRightArrow } from "../../images";

export const UserRolesAdd = () => {
  const { roleId } = useParams();
  const [form] = Form.useForm();
  const [importPermissions, setImportPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleData, setRoleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roleId) {
      setIsEditMode(true);
      fetchEditRoleData();
    } else {
      fetchImportPermissions();
    }
  }, [roleId]);

  const fetchImportPermissions = async () => {
    setLoading(true);
    try {
      const response = await rolesService.getRoleList();
      if (response?.status) {
        setImportPermissions(response.data);
      }
    } catch (error) {
      console.error("Error fetching import permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditRoleData = async () => {
    setLoading(true);
    try {
      const response = await rolesService.getEditRoleList(roleId);
      if (response.status) {
        const roleDetails = response.data;
        setRoleData(roleDetails);
        setSelectedRoleId(roleDetails.importedPermissionId);

        // Get role name from import permissions list
        const roleName =
          importPermissions.find(
            (r) => r.role_id === roleDetails.importedPermissionId
          )?.role_name || "";

        // Set form fields for edit mode
        form.setFieldsValue({
          roleName: roleDetails.newRoleName,
          roleDescription: roleDetails.roleDescription,
          importPermissions: roleDetails.importedPermissionName,
        });

        // Fetch table details using getRoleDetails API
        fetchRoleDetails(roleDetails.roleId);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch role details for the table using getRoleDetails API
  const fetchRoleDetails = async (roleId) => {
    setLoading(true);
    try {
      const response = await rolesService.getRoleDetails(roleId);
      if (response) {
        setRoleData(response);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (roleId) => {
    setLoading(true);
    setSelectedRoleId(roleId);
    try {
      const response = await rolesService.getRoleDetails(roleId);
      if (response) {
        setRoleData(response);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (
    moduleName,
    subModuleName,
    permissionType,
    checked
  ) => {
    setRoleData((prev) => {
      const updatedRoleData = structuredClone(prev); // Deep clone to prevent state mutation

      if (!updatedRoleData[moduleName]) {
        updatedRoleData[moduleName] = {}; // Ensure module exists
      }

      if (subModuleName) {
        if (!updatedRoleData[moduleName][subModuleName]) {
          updatedRoleData[moduleName][subModuleName] = {}; // Ensure submodule exists
        }
        updatedRoleData[moduleName][subModuleName][permissionType] = checked
          ? "1"
          : "0";
      } else {
        updatedRoleData[moduleName][permissionType] = checked ? "1" : "0";
      }

      return { ...updatedRoleData }; // Ensure React detects the change
    });
  };

  const handleSubmit = async () => {
    setLoading(false);
    setSubmitting(true);
    const payload = {
      importedPermissionId: selectedRoleId,
      importedPermissionName:
        importPermissions.find((r) => r.role_id === selectedRoleId)
          ?.role_name || "",
      newRoleName: form.getFieldValue("roleName"),
      roleId: isEditMode ? parseInt(roleId) : undefined,
      roleDescription: form.getFieldValue("roleDescription"),
      ...roleData,
    };

    try {
      if (isEditMode) {
        await rolesService.editCustomRole(payload);
      } else {
        await rolesService.addCustomRole(payload);
      }

      // navigate("/app/admin/usersettings/roles");
      // window.location.reload(); // Ensure fresh data loads
    } catch (error) {
      console.error("Error submitting role:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-company-information">
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
            overlay={<OverlayMenuDropdown type="User settings" />}
          >
            User settings
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/app/admin/usersettings/roles">Roles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {isEditMode ? "Edit custom role" : "Create custom role"}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="common-SpaceAdmin">
        <Spin spinning={loading}>
          <div className="zn-admin-Card">
            <ConfigProvider>
              <Form form={form} layout="vertical" name="roleForm">
                <div className="zn-card-body height-card-roles mb-5 p-4">
                  <div className="row">
                    <div className="user-role-main-header">
                      <div className="zn-light-primary-color zn-fs-s zn-fw-500">
                        {isEditMode ? "Edit user role" : "Add user role"}
                      </div>
                      <div>
                        {isEditMode
                          ? "Edit a user role with custom permissions"
                          : "Create a user role with custom permissions"}
                      </div>
                    </div>
                    <div className="row d-flex align-items-stretch">
                      <div className="col-lg-4">
                        <Form.Item
                          label="Import permissions"
                          name="importPermissions"
                          required
                        >
                          <Select
                            placeholder="Select permission"
                            size="large"
                            disabled={isEditMode}
                            onChange={handleRoleSelect}
                            loading={loading}
                            options={importPermissions.map((role) => ({
                              value: role.role_id,
                              label:
                                role.role_name.charAt(0).toUpperCase() +
                                role.role_name.slice(1).toLowerCase(),
                            }))}
                            style={{ height: "48px" }}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-4">
                        <Form.Item label="Role name" name="roleName" required>
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter role name"
                            style={{ height: "48px" }}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-lg-4">
                        <Form.Item
                          label="Role Description"
                          name="roleDescription"
                          required
                        >
                          <Input
                            placeholder="Enter role description"
                            type="text"
                            size="large"
                            style={{
                              height: "48px",
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  {loading ? (
                    <Spin size="large" />
                  ) : (
                    selectedRoleId &&
                    roleData &&
                    Object.keys(roleData).length > 0 && (
                      <div className="roles-active-sec">
                        <div className="table-responsive">
                          <table className="col-md-10 roles-active-table">
                            <thead>
                              <tr>
                                <th>Modules</th>
                                <th className="text-center">Add</th>
                                <th className="text-center">View</th>
                                <th className="text-center">Edit</th>
                                <th className="text-center">Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(roleData).map(
                                ([moduleName, module]) => (
                                  <React.Fragment key={module.id}>
                                    <tr>
                                      <td>
                                        <strong>
                                          {moduleName
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char) =>
                                              char.toUpperCase()
                                            )}
                                        </strong>
                                      </td>
                                      {[
                                        "addAccess",
                                        "viewAccess",
                                        "editAccess",
                                        "deleteAccess",
                                      ].map((permissionType) => (
                                        <td
                                          className="text-center"
                                          key={permissionType}
                                        >
                                          <Checkbox
                                            checked={
                                              module[permissionType] === "1"
                                            }
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                moduleName,
                                                null,
                                                permissionType,
                                                e.target.checked
                                              )
                                            }
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                    {Object.entries(module)
                                      .filter(
                                        ([key, value]) =>
                                          typeof value === "object" &&
                                          value !== null
                                      )
                                      .map(
                                        (
                                          [submoduleName, submodule],
                                          index,
                                          array
                                        ) => (
                                          <tr
                                            key={submodule.id}
                                            className="roles-group-body"
                                          >
                                            <td className="tree-view-list">
                                              <span
                                                style={{
                                                  height:
                                                    index === array.length - 1
                                                      ? "24px"
                                                      : "auto",
                                                }}
                                              >
                                                {submoduleName
                                                  .toLowerCase()
                                                  .replace(/\b\w/g, (char) =>
                                                    char.toUpperCase()
                                                  )}
                                              </span>
                                            </td>
                                            {[
                                              "addAccess",
                                              "viewAccess",
                                              "editAccess",
                                              "deleteAccess",
                                            ].map((permissionType) => (
                                              <td
                                                className="text-center"
                                                key={permissionType}
                                              >
                                                <Checkbox
                                                  checked={
                                                    submodule[
                                                      permissionType
                                                    ] === "1"
                                                  }
                                                  onChange={(e) =>
                                                    handleCheckboxChange(
                                                      moduleName,
                                                      submoduleName,
                                                      permissionType,
                                                      e.target.checked
                                                    )
                                                  }
                                                />
                                              </td>
                                            ))}
                                          </tr>
                                        )
                                      )}
                                    <tr className="module-divider">
                                      <td colSpan={5}></td>
                                    </tr>
                                  </React.Fragment>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="bg-white add-form-footer-btns add-form-footer d-flex align-items-center justify-content-end gap-3">
                  <Button
                    className="zn-fw-500 zn-fs-s zn-light-primary-color"
                    size="small"
                    type="secondary"
                  >
                    <Link to="/app/admin/usersettings/roles">Cancel</Link>
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </div>
              </Form>
            </ConfigProvider>
          </div>
        </Spin>
      </div>
    </div>
  );
};
