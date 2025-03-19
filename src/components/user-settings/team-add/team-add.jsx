import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Form,
  Input,
  Select,
  TreeSelect,
  message,
  notification,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ZinRightArrow } from "../../images";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { authorizationService } from "../../../service";
import "../team/index.scss";
import { Spin } from "antd";

const { SHOW_PARENT } = TreeSelect;

export const UserTeamsAdd = () => {
  const [form] = Form.useForm();
  const [teamName, setTeamName] = useState("");
  const [managers, setManagers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { id: teamId } = useParams();
  const [loading, setLoading] = useState(false);
  const [teamNameError, setTeamNameError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
    if (teamId) {
      loadTeamDetails(teamId);
      setIsEditing(true);
    }
  }, [teamId]);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const response = await authorizationService.getTeamLeaders();
      if (response?.status && Array.isArray(response.data)) {
        setManagers(
          response.data.map((manager) => ({
            value: manager.userId,
            label: `${manager.firstName} ${manager.lastName} (${manager.roleName})`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (managerId) => {
    setLoading(true);
    try {
      const response = await authorizationService.getReportingTeamMates(
        managerId
      );
      if (response?.status && Array.isArray(response.data)) {
        setMembers(
          response.data.map((member) => ({
            title: `${member.firstName} ${member.lastName} (${member.roleName})`,
            value: member.userId,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamDetails = async (teamId) => {
    setLoading(true);
    try {
      const response = await authorizationService.getTeamDetailedView(teamId);
      if (response?.status && response.data) {
        const teamData = response.data;

        setTeamName(teamData.teamName || "");
        setSelectedManager(teamData.reportingManagerId || null);
        setSelectedMembers(teamData.teamMembersIds || []);

        form.setFieldsValue({
          teamName: teamData.teamName || "",
          manager: teamData.reportingManagerId || null,
          members: teamData.teamMembersIds || [],
        });

        fetchMembers(teamData.reportingManagerId);
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManagerChange = (managerId) => {
    setSelectedManager(managerId);
    setMembers([]);
    setSelectedMembers([]);
    form.setFieldsValue({ members: [] });
    fetchMembers(managerId);
  };

  // const checkTeamNameExists = async (teamName) => {
  //   try {
  //     const response = await authorizationService.checkTeamNameExists(teamName);
  //     return response?.data?.exists || false;
  //   } catch (error) {
  //     console.error("Error checking team name:", error);
  //     return false;
  //   }
  // };

  const handleSave = async (values) => {
    console.log("response", values)
    setLoading(true);
    const teamData = {
      team_name: values && values.teamName,
      team_manager: selectedManager,
      other_team_members: selectedMembers,
    };
    try {
      let response;
      if (isEditing) {
        response = await authorizationService.updateTeam(teamId, teamData);
        navigate("/app/admin/usersettings/teams");
      } else {
        response = await authorizationService.addTeam(teamData);
        navigate("/app/admin/usersettings/teams");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving source:", error);
    } finally {
      setLoading(false);
    }
    // getJobSourceView();
    // try {
    //   await form.validateFields();
    //   setLoading(true);
    //   const teamData = {
    //     team_name: teamName,
    //     team_manager: selectedManager,
    //     other_team_members: selectedMembers,
    //   };

    //   let response;
    //   if (isEditing) {
    //     response = await authorizationService.updateTeam(teamId, teamData);
    //   } else {
    //     response = await authorizationService.addTeam(teamData);
    //   }

    //   // if (response?.status) {
    //   //   message.success(response && response.data)
    //   //   navigate("/app/admin/usersettings/teams");
    //   // } else {
    //   //   message.error("Something went wrong, please reload")
    //   // }
    // } catch (error) {
    //   console.error("Error saving team:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const preventNumberInput = (e) => {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="admin-breadcrums">
        <div className="w-100 d-flex align-items-center justify-content-between">
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
              <Link to="/app/admin/usersettings/teams">Teams</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{isEditing ? "Edit" : "Add"}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="admin-Layout">
        <div className="bg-white candidates-addForm">
          <ConfigProvider
            getPopupContainer={(triggerNode) => triggerNode?.parentNode}
          >
            <Spin spinning={loading}>
              <Form
                form={form}
                className="add-form"
                layout="vertical"
                name="nest-messages"
                onFinish={handleSave}
              >
                <div className="add-user-Form">
                  <div className="row">
                    <div className="col-lg-6">
                      <Form.Item
                        label="Team name"
                        name="teamName"
                        validateStatus={teamNameError ? "error" : ""}
                        help={teamNameError}
                        rules={[
                          {
                            required: true,
                            message: "Team Name is required",
                          },
                          {
                            min: 2,
                            message:
                              "Team name must be at least 2 characters",
                          },
                          {
                            pattern: /^[A-Za-z\s]+$/,
                            message: "Only letters and spaces are allowed",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Enter team name"
                          value={teamName}
                          onKeyPress={preventNumberInput}
                          onChange={(e) => {
                            setTeamName(e.target.value);
                            setTeamNameError("");
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-lg-6">
                      <Form.Item
                        label="Manager"
                        name="manager"
                        rules={[
                          { required: true, message: "Manager is required" },
                        ]}
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="Select manager"
                          value={selectedManager}
                          onChange={handleManagerChange}
                          options={managers}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-lg-6">
                      <Form.Item
                        label="Members"
                        name="members"
                        rules={[
                          { required: true, message: "Members are required" },
                        ]}
                      >
                        <TreeSelect
                          size="large"
                          treeData={members}
                          value={selectedMembers}
                          onChange={(values) => {
                            setSelectedMembers(values);
                            form.setFieldsValue({ members: values });
                          }}
                          treeCheckable
                          showCheckedStrategy={SHOW_PARENT}
                          placeholder="Select members"
                          style={{ width: "100%" }}
                          disabled={!selectedManager}
                          filterTreeNode={(input, option) =>
                            option.title
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="bg-white add-form-footer d-flex align-items-center justify-content-end gap-3">
                  <Button
                    className="zn-fw-500 zn-fs-s zn-light-primary-color"
                    size="small"
                  >
                    <Link to="/app/admin/usersettings/teams">Cancel</Link>
                  </Button>
                  <Button
                    className="zn-fw-500 zn-fs-s"
                    size="small"
                    type="primary"
                    htmlType="submit"

                  >
                    {isEditing ? "Update" : "Save"}
                  </Button>
                </div>
              </Form>
            </Spin>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
};