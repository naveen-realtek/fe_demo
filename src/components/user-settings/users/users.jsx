import React, { useState, useRef, useEffect } from "react";
import {
  Breadcrumb,
  Table,
  Switch,
  Button,
  Avatar,
  Tooltip,
  Input,
  Form,
  Image,
  Dropdown,
  Spin
} from "antd";
import { Link } from "react-router-dom";
import {
  ZinRightArrow,
  ZinEditIcon,
  ZinInfo,
  ZinSearch,
  ZinClear,
  ZinSort,
} from "../../images";
import { authorizationService, candidateService } from "../../../service";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { useNavigate } from "react-router-dom";
import { CheckOutlined } from "@ant-design/icons";
import "./index.scss";

export const AdminUser = () => {
  const [delegatedUsers, setDelegatedUsers] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [searchError, setSearchError] = useState("");
  const inputRef = useRef(null);
  const [candidateSearchForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [userProfileData, setUserProfileData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const rowsPerPage = 10;

  const handleViewUserDetails = (user) => {
    navigate(`/app/admin/usersettings/user/add?userId=${user.userId}`, {
      state: { userDetails: user, isEditMode: true },
    });
  };

  const userDataApi = async (page = 1, search = "") => {
    const limit = rowsPerPage;
    setLoadingList(true);
    const offset = (page - 1) * limit;

    try {
      const response = await authorizationService.getAllUsers(offset, limit, search);
      setLoadingList(false);

      if (response?.data) {
        let users = response.data.users;

        const usersWithPhotos = users.filter(user => user.photoLocation && user.photoLocation.trim() !== "");

        if (usersWithPhotos.length > 0) {
          const profileRequests = usersWithPhotos.map(user =>
            candidateService.getUserProfile(user.photoLocation)
          );

          const profileResponses = await Promise.allSettled(profileRequests);

          users = users.map(user => {
            const index = usersWithPhotos.findIndex(u => u.photoLocation === user.photoLocation);
            if (index !== -1 && profileResponses[index].status === "fulfilled") {
              return { ...user, photoLocation: profileResponses[index].value?.data };
            }
            return user;
          });
        }

        setUserProfileData(users);
        setFilteredData(users);
        setTotalRows(response.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    userDataApi(currentPage, searchText);
  }, [currentPage, searchText]);

  const handleSearch = (event) => {
    const value = event.target.value.trim();
    setSearchText(value);

    if (value.length < 3 && value.length > 0) {
      return;
    }

    userDataApi(1, value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    userDataApi(1, "");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    userDataApi(newPage, searchText);
  };

  const usercolumns = [
    {
      key: "1",
      dataIndex: ["nameTitle", "firstName", "lastName", "photoLocation"],
      title: "Name",
      ellipsis: true,
      width: 200,
      className: "Name-column-user",
      render: (_, data) => {
        const hasPhoto = data.photoLocation;
        const defaultAvatar = "/path/to/default-avatar.png";

        return (
          <Tooltip title={`${data.nameTitle ? data.nameTitle + "." : ""} ${data.firstName} ${data.lastName}`}>
            <div className="user-name-cell">
              <span className="user-name">
                {data.firstName} {data.lastName}
              </span>
            </div>
          </Tooltip>
        );
      },
    },
    {
      key: "2",
      title: "Role",
      dataIndex: "roleName",
      render: (roleName) => (
        <Tooltip title={roleName}>
          <div>{roleName}</div>
        </Tooltip>
      ),
      width: 150,
      ellipsis: true,
    },
    {
      key: "3",
      title: "Team",
      dataIndex: "teamName",
      width: 180,
      ellipsis: true,
      render: (team) => (
        <Tooltip title={team}>
          <div>{team || "N/A"}</div>
        </Tooltip>
      ),
    },
    {
      key: "4",
      title: "Reporting Manager",
      dataIndex: "reportingName",
      width: 180,
      ellipsis: true,
      render: (reportingName) => (
        <Tooltip title={reportingName}>
          <div>{reportingName || "N/A"}</div>
        </Tooltip>
      ),
    },
    {
      key: "5",
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <Tooltip title={email}>
          <div>{email}</div>
        </Tooltip>
      ),
      width: 250,
      ellipsis: true,
    },
    {
      key: "6",
      title: "Phone",
      dataIndex: "phoneNumber",
      width: 150,
      ellipsis: true,
      render: (phone, record) => (
        <Tooltip title={phone || record.phoneExtension}>
          <div>{phone || record.phoneExtension || "N/A"}</div>
        </Tooltip>
      ),
    },
    {
      key: "7",
      title: "Location",
      dataIndex: "location",
      width: 180,
      ellipsis: true,
      render: (location) => (
        <Tooltip title={location}>{location || "N/A"}</Tooltip>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) =>
        delegatedUsers[record.userId] ? (
          <span className="delegated-text">Delegated</span>
        ) : (
          <Switch checked={record.status === "1" ? true : false} />
        ),
      align: "center",
      className: "statususercolumn-sticky",
    },
    {
      key: "8",
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="ActionButton-user">
          <div
            onClick={() => handleViewUserDetails(record)}
            style={{ cursor: "pointer" }}
          >
            <ZinEditIcon />
          </div>
        </div>
      ),
      className: "actioncolumn-sticky",
    },
  ];

  return (
    <div className="">
      <div className="admin-breadcrums">
        <div className="d-flex w-100 justify-content-between">
          <Breadcrumb separator={<ZinRightArrow />}>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/dashboard">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">
              <Link to="/app/admin">Admin</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item
              overlay={<OverlayMenuDropdown type="User settings" />}
              className="breadcrumbsLink"
            >
              User settings
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbsLink">User</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <Link>
              <ZinInfo />
            </Link>
          </div>
        </div>
      </div>
      <div className="admin-Layout">
        <div className="d-flex align-items-center user-buttons-top">
          <div className="search-toolset">
            <ZinSearch onClick={() => inputRef.current?.focus()} />
            <Input
              ref={inputRef}
              placeholder="Search users"
              value={searchText}
              onChange={handleSearch}
              suffix={
                searchText ? (
                  <ZinClear onClick={handleClearSearch} style={{ cursor: "pointer" }} />
                ) : null
              }
              autoFocus
            />
          </div>
          <div className="toolbar me-3 ms-3 text-end">
            <Button type="primary" size="small">
              <Link to="/app/admin/usersettings/user/add">Add</Link>
            </Button>
          </div>
        </div>

        <Spin spinning={loadingList} size="large">
          <Table
            columns={usercolumns}
            dataSource={filteredData}
            pagination={{
              current: currentPage,
              pageSize: rowsPerPage,
              total: totalRows,
              onChange: handlePageChange,
            }}
            scroll={{ x: 1500, y: "calc(100vh -  346px)" }}
          />
        </Spin>
      </div>
    </div>
  );
};