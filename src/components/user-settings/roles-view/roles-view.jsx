import React, { useEffect, useState } from "react";
import { Breadcrumb, Checkbox, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { ZinRightArrow, ZinSolidUsers } from "../../images";
import { rolesService } from "../../../service";
import { useLocation } from "react-router-dom";

export const UserRolesView = () => {
  const { roleId } = useParams();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [roleName, setRoleName] = useState(
    location.state?.roleName || "Role Details"
  );
  const roleDescription =
    location.state?.roleDescription || "No description available";
  const userCount = location.state?.userCount || 0;

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const data = await rolesService.getRoleDetails(roleId);
        if (data && Object.keys(data).length > 0) {
          setRoleData(data);

          // Update role name if it was not passed via location.state
          if (!location.state?.roleName) {
            setRoleName(data.role_name);
          }
        } else {
          setError("No role data available.");
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
        setError("Failed to fetch role details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [roleId, location.state?.roleName]);

  const renderCheckbox = (value) => (
    <Checkbox checked={value === "1"} disabled />
  );

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!roleData) {
    return <div className="no-data">No role data available.</div>;
  }

  return (
    <div className="fixed-container">
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
            {roleName
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className=" zn-admin-Card admin-Layout margin-left-container">
        <div className="zn-fs-m zn-fw-700 mb-2 fixed-header">
          Zinnext Default
        </div>
        <div className="zn-card">
          <div className="zn-card-body-roles">
            <div className="roles-list fixed-card">
              <div className="d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2">
                <div className="me-3">
                  <div className=" zn-light-primary-color">
                    {roleName
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </div>
                  <div className="zn-light-text-dark-color">
                    {roleDescription}
                  </div>
                </div>
                <div className="align-self-center zn-light-text-dark-color d-flex">
                  <ZinSolidUsers />
                  &nbsp;&nbsp;{userCount}
                </div>
              </div>
            </div>

            <div className="roles-active-sec">
              <div className="table-responsive">
                <table className="col-md-10 roles-active-table ">
                  <thead className="fixed-header">
                    <tr>
                      <th>Modules</th>
                      <th className="text-center">Add</th>
                      <th className="text-center">View</th>
                      <th className="text-center">Edit</th>
                      <th className="text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleData &&
                      Object.entries(roleData).map(([moduleName, module]) => (
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
                            <td className="text-center">
                              {renderCheckbox(module.addAccess)}
                            </td>
                            <td className="text-center">
                              {renderCheckbox(module.viewAccess)}
                            </td>
                            <td className="text-center">
                              {renderCheckbox(module.editAccess)}
                            </td>
                            <td className="text-center">
                              {renderCheckbox(module.deleteAccess)}
                            </td>
                          </tr>

                          {/* Render submodules if they exist */}

                          {Object.entries(module)
                            .filter(
                              ([key, value]) =>
                                typeof value === "object" && value !== null
                            )
                            .map(([submoduleName, submodule], index, array) => (
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
                                <td className="text-center">
                                  {renderCheckbox(submodule.addAccess)}
                                </td>
                                <td className="text-center">
                                  {renderCheckbox(submodule.viewAccess)}
                                </td>
                                <td className="text-center">
                                  {renderCheckbox(submodule.editAccess)}
                                </td>
                                <td className="text-center">
                                  {renderCheckbox(submodule.deleteAccess)}
                                </td>
                              </tr>
                            ))}

                          <tr className="module-divider">
                            <td colSpan={5}></td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
