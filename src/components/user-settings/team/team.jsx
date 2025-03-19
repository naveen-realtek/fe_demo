
import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Table, notification, Spin } from "antd";
import { Link } from "react-router-dom";
import { ZinEditIcon, ZinRightArrow } from "../../images";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { authorizationService } from "../../../service";
import TeamMembersList from "./TeamMembersList";
import TeamDetailDrawer from "./teamDetailDrawer";
import "./index.scss";

export const UserTeams = () => {
  const [usersTeamData, setUsersTeamData] = useState([]);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  useEffect(() => {
    fetchTeams();
  }, []);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false
    },
  });

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const offset = 0;
      const response = await authorizationService.getAllTeams(
        offset,
        10
      );
      setUsersTeamData(response && response.teams);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response?.totalCount,
        },
      });
      // if (response?.teams && Array.isArray(response.teams)) {
      //   const formattedTeams = response.teams.map((team) => ({
      //     key: team.teamId,
      //     id: team.teamId,
      //     name: team.teamName || `Team ${team.teamId}`,
      //     noOfMembers: team.noOfTeamMembers || 0,
      //     reportingManager: team.reportingManager || "N/A",
      //     members: Array.isArray(team.teamMembers) ? team.teamMembers : [],
      //   }));

      //   setUsersTeamData(formattedTeams);
      //   setPagination((prev) => ({ ...prev, total: response.totalCount || 0 }));
      // } else {
      //   console.error("Invalid response format", response);
      //   setUsersTeamData([]);
      //   setPagination((prev) => ({ ...prev, total: 0 }));
      // }
    } catch (error) {
      console.error("Error fetching teams:", error);
      notification.error({ message: "Failed to fetch teams" });
      setUsersTeamData([]);
    } finally {
      setLoading(false);
    }
  };
  const limit = 10;
  const handleTableChange = async (pagination) => {
    setLoading(true);
    const page = pagination.current - 1;
    const pageSize = pagination.pageSize;
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        current: pagination.current,
        pageSize: pageSize,
      },
    }));
    const offset = page * pageSize;
    if (pageSize !== tableParams.pagination?.pageSize) {
      setUsersTeamData([]);
    }
    const response = await authorizationService.getAllTeams(
      offset,
      limit
    );
    setLoading(false);
    setUsersTeamData(response.teams)
    // setPagination((prev) => ({
    //   ...prev,
    //   current: pagination.current,
    //   pageSize: pagination.pageSize,
    // }));
  };

  const openUserDrawer = (teamId) => {
    setSelectedTeamId(teamId);
    setUserDrawerOpen(true);
  };

  const closeDrawer = () => {
    setUserDrawerOpen(false);
    setSelectedTeamId(null);
    fetchTeams(); // Reload teams after update
  };

  const columns = [
    {
      key: "1",
      title: "Name",
      dataIndex: "teamName",
      width: 180,
      render: (name, team) => name ? (
        <>
          <a
            className="cursor-pointer openUserDrawer"
            onClick={() => openUserDrawer(team.id)}
          >
            {name}
          </a>
        </>
      ) : "N/A"
    },
    {
      key: "2",
      title: "No of Members",
      width: 160,
      dataIndex: "noOfTeamMembers",
    },
    {
      key: "3",
      title: "Members",
      dataIndex: "teamMembers",
      className: "team-members-tags",
      width: 260,
      render: (members) => (members ? (<><TeamMembersList members={members} /></>) : "N/A"),
    },
    {
      key: "4",
      title: "Reporting Manager",
      width: 130,
      dataIndex: "reportingManager",
      render: (reportingManager) => (reportingManager ? (<>{reportingManager}</>) : "N/A"),
    },
    {
      key: "5",
      title: "Action",
      dataIndex: "teamId",
      fixed: "right",
      width: 120,
      render: (teamId) => (
        <div className="d-flex justify-content-center gap-4">
          <Link to={`/app/admin/usersettings/teams/edit/${teamId}`}>
            <ZinEditIcon className="cursor-pointer" />
          </Link>
        </div>
      ),
      align: "center",
      className: "actioncolumn-sticky",
    },
  ];

  return (
    <>
      <div className="admin-breadcrums d-flex justify-content-between align-items-center">
        <Breadcrumb separator={<ZinRightArrow />}>
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
          <Breadcrumb.Item>Teams</Breadcrumb.Item>
        </Breadcrumb>
        <Button type="primary" size="small" className="add-button-team">
          <Link to="/app/admin/usersettings/teams/add">Add</Link>
        </Button>
      </div>

      <div className="common-SpaceAdmin">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={usersTeamData}
            scroll={{ y: "calc(100vh - 250px)" }}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </div>

      <TeamDetailDrawer
        open={userDrawerOpen}
        onClose={closeDrawer}
        teamId={selectedTeamId}
      />
    </>
  );
};
