import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb, Button, Table, notification, Spin, Input } from "antd";
import { Link } from "react-router-dom";
import { ZinEditIcon, ZinRightArrow, ZinSearch, ZinClear } from "../../images";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { authorizationService } from "../../../service";
import TeamMembersList from "./TeamMembersList";
import TeamDetailDrawer from "./teamDetailDrawer";
import "./index.scss";

export const UserTeams = () => {
  const [usersTeamData, setUsersTeamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const inputFocusElement = useRef(null);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchTeams();
  }, [currentPage]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * rowsPerPage;
      const response = await authorizationService.getAllTeams(offset, rowsPerPage);

      if (response?.teams) {
        setUsersTeamData(response.teams);
        setFilteredData(response.teams);
        setTotalRows(response.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      notification.error({ message: "Failed to fetch teams" });
      setUsersTeamData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);

    if (value.length < 3 && value.length > 0) return;

    if (value) {
      const filtered = usersTeamData.filter((team) =>
        team.teamName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(usersTeamData);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredData(usersTeamData);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
      render: (name, team) =>
        name ? (
          <a className="cursor-pointer openUserDrawer" onClick={() => openUserDrawer(team.id)}>
            {name}
          </a>
        ) : (
          "N/A"
        ),
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
      render: (members) => (members ? <TeamMembersList members={members} /> : "N/A"),
    },
    {
      key: "4",
      title: "Reporting Manager",
      width: 130,
      dataIndex: "reportingManager",
      render: (reportingManager) => (reportingManager ? reportingManager : "N/A"),
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
          <Breadcrumb.Item overlay={<OverlayMenuDropdown type="User settings" />}>
            User settings
          </Breadcrumb.Item>
          <Breadcrumb.Item>Teams</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex align-items-center user-buttons-top">

        <div className="search-toolset">

          <ZinSearch onClick={() => inputFocusElement.current?.focus()} />
          <Input
            ref={inputFocusElement}
            placeholder="Search teams"
            value={searchText}
            onChange={handleSearch}
            suffix={
              searchText ? <ZinClear onClick={handleClearSearch} style={{ cursor: "pointer" }} /> : null
            }
            autoFocus
          />
           </div>
           <div className="toolbar me-3 ms-3 text-end">
          <Button type="primary" size="small" className="add-button-team">
            <Link to="/app/admin/usersettings/teams/add">Add</Link>
          </Button>
          </div>
          </div>
      </div>

      <div className="common-SpaceAdmin">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            scroll={{ y: "calc(100vh - 250px)" }}
            pagination={{
              current: currentPage,
              pageSize: rowsPerPage,
              total: totalRows,
              onChange: handlePageChange,
            }}
          />
        </Spin>
      </div>

      <TeamDetailDrawer open={userDrawerOpen} onClose={closeDrawer} teamId={selectedTeamId} />
    </>
  );
};
