import { Breadcrumb, Button, Spin, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import {
  ZinDeleteIcon,
  ZinEditIcon,
  ZinRightArrow,
  ZinSolidUsers,
} from "../../images";
import { RoleService } from "../../../service/role-service";

export const UserRoles = () => {
  const [roleData, setRoleData] = useState([]);
  const [customRoleData, setCustomRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const roleService = new RoleService();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  // Modal State
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch roles from API
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const rolesResponse = await roleService.getRoles();
      setRoleData(rolesResponse.zinnext_default);
      setCustomRoleData(
        rolesResponse.custom_roles.map((role) => ({
          ...role,
          role_description: role.role_description || "No description available",
        }))
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const showDeleteConfirm = (role) => {
    setRoleToDelete(role);

    if (role.user_count > 0) {
      setIsErrorModalVisible(true); // Show error popup if role is assigned
    } else {
      setIsDeleteModalVisible(true); // Show delete confirmation if role is unassigned
    }
  };

  // Handle role deletion
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    setDeleting(true); // ⬅️ Show full-page spinner
    try {
      const response = await roleService.deleteRole(
        roleToDelete.role_id,
        roleToDelete
      );

      if (response.status) {
        setCustomRoleData((prevRoles) =>
          prevRoles.filter((role) => role.id !== roleToDelete.id)
        );
        setIsDeleteModalVisible(false);
      } else {
        setIsErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      setIsErrorModalVisible(true);
    } finally {
      setDeleting(false); // ⬅️ Hide full-page spinner after deletion
    }
  };

  return (
    <div className="user-roles-page">
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
          <Breadcrumb.Item>Roles</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="common-SpaceAdmin">
        <Spin spinning={loading}>
          <div className="zn-card">
            <div>
              {loading ? (
                <div className="spinner-container">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  {/* Default Roles Section */}
                  <div className="zn-fs-m zn-fw-700 mb-2">Zinnext Default</div>
                  <div className="roles-list mb-4">
                    <ul>
                      {roleData.length > 0 ? (
                        roleData.map((role) => (
                          <li key={role.id}>
                            <Link
                              to={`/app/admin/usersettings/roles/${role.role_id}`}
                              state={{
                                roleName: role.role_name,
                                roleDescription: role.role_description,
                                userCount: role.user_count,
                              }}
                            >
                              <div className="d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2">
                                <div className="me-3">
                                  <div className="zn-light-primary-color role-name-div">
                                    {role.role_name
                                      .toLowerCase()
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                      )}
                                  </div>
                                  <div className="zn-light-text-dark-color">
                                    {role.role_description}
                                  </div>
                                </div>
                                <div className="align-self-center zn-light-text-dark-color d-flex">
                                  <ZinSolidUsers /> &nbsp;&nbsp;
                                  {role.user_count}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <div className="zn-light-text-dark-color">
                          No default roles available
                        </div>
                      )}
                    </ul>
                  </div>

                  {/* Custom Roles Section */}
                  <div className="coustom-roles_list mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="zn-fs-m zn-fw-700">Custom User Roles</div>
                      <div>
                        <Button type="primary" size="small">
                          <Link to="/app/admin/usersettings/roles/add">
                            Add
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="roles-list mb-4">
                    <ul>
                      {customRoleData.length > 0 ? (
                        customRoleData.map((customRole) => (
                          <li key={customRole.id}>
                            <div className="d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2">
                              <Link
                                to={`/app/admin/usersettings/roles/${customRole.role_id}`}
                                state={{
                                  roleName: customRole.role_name,
                                  roleDescription: customRole.role_description,
                                }}
                              >
                                <div className="me-3">
                                  <div className="zn-light-primary-color">
                                    {customRole.role_name}
                                  </div>
                                  <div className="zn-light-text-dark-color">
                                    {customRole.role_description ||
                                      "No description available"}
                                  </div>
                                </div>
                              </Link>
                              <div className="align-self-center zn-light-text-dark-color d-flex">
                                <div
                                  className="me-4"
                                  onClick={() => showDeleteConfirm(customRole)}
                                >
                                  <ZinDeleteIcon
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                                <div
                                  className="me-4"
                                  onClick={() =>
                                    navigate(
                                      `/app/admin/usersettings/roles/edit/${customRole.role_id}`
                                    )
                                  }
                                >
                                  <ZinEditIcon style={{ cursor: "pointer" }} />
                                </div>
                                <div>
                                  <ZinSolidUsers /> &nbsp;&nbsp;
                                  {customRole.user_count || 0}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="zn-light-text-dark-color">
                          No custom roles available
                        </div>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </Spin>
      </div>

      <Modal
        key={isDeleteModalVisible || isErrorModalVisible}
        title={
          isDeleteModalVisible
            ? "Confirm Deletion"
            : "Delete User Role - Cannot Delete"
        }
        open={isDeleteModalVisible || isErrorModalVisible}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setIsErrorModalVisible(false);
        }}
        footer={
          isDeleteModalVisible ? (
            <>
              <Button
                type="seconday"
                size="small"
                onClick={() => setIsDeleteModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={handleDeleteRole}
                className="ms-3"
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              key="ok"
              type="primary"
              size="small"
              onClick={() => setIsErrorModalVisible(false)}
            >
              Okay
            </Button>
          )
        }
      >
        {isDeleteModalVisible ? (
          <div className="row">
            <p>Are you sure you want to delete this role?</p>
            <div className="on-submitaddClient">
              <Button
                type="seconday"
                size="small"
                onClick={() => setIsDeleteModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={handleDeleteRole}
                className="ms-3"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>This user role is assigned to active users.</p>
            <p>Only user roles not assigned to any user can be deleted.</p>
          </>
        )}
        {deleting && (
          <div className="spinner-overlay">
            <Spin size="large" />
          </div>
        )}
      </Modal>
    </div>
  );
};
