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


  const handleViewUserDetails = (user) => {
    navigate(`/app/admin/usersettings/user/add?userId=${user.userId}`, {
      state: { userDetails: user, isEditMode: true },
    });
  };

  const [loadingList, setLoadingList] = useState(false);
  const [userProfileData, setUserProfileData] = useState([]);

  const userDataApi = async (page = 1) => {
    const limit = 10;
    setLoadingList(true);
    const offset = (page - 1) * limit; // Calculate offset dynamically

    try {
      const response = await authorizationService.getAllUsers(offset, limit, selectedItem || "");
      setLoadingList(false);

      if (response?.data) {
        let users = response.data.users;

        // Filter out users with null, undefined, or empty photoLocation
        const usersWithPhotos = users.filter(user => user.photoLocation && user.photoLocation.trim() !== "");

        if (usersWithPhotos.length > 0) {
          // Fetch profile images only for users who have a valid photoLocation
          const profileRequests = usersWithPhotos.map(user =>
            candidateService.getUserProfile(user.photoLocation)
          );

          const profileResponses = await Promise.allSettled(profileRequests);

          // Map profile images back to users
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
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: response && response.data.totalCount,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    userDataApi();
  }, []);

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
        console.log("hasPhoto", hasPhoto);
        const defaultAvatar = "/path/to/default-avatar.png"; // Change to your default image path

        return (
          <Tooltip title={`${data.nameTitle ? data.nameTitle + "." : ""} ${data.firstName} ${data.lastName}`}>
            <div className="user-name-cell">
              <span className="user-name">
                {data.firstName} {data.lastName}
              </span>
              {/* <Image
                width={100}
                src={hasPhoto}
                alt={data.firstName}
              /> */}
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

  const clientExport = () => {
    //export modalpopup
    setOpenExport(true);
  };

  const handleDelegate = (userId) => {
    setDelegatedUsers((prev) => ({ ...prev, [userId]: true }));
  };

  const [searchQueryValue, setSearchQueryValue] = useState('');

  const submissionSearchChange = async (value) => {
    if (value.length > 0) {
      setSearchQueryValue(value);
    } else {
      clearFunc();
    }
  }
  const clearFunc = async () => {
    const searchData = {
      searchValue: searchQueryValue,
    };
    setSearchQueryValue("")
    const res = await authorizationService.searchUsers(0, 10, searchData.searchValue);

  };

  const onFinishSubmissionSearch = async ({ searchValue }) => {
    if (searchValue.length >= 3) {
      await authorizationService.searchUsers(0, 10, searchValue);
    }
  };

  const sortingList = [
    {
      label: " Recently added",
      key: "1",
      icon: selectedItem === "new" ? <div className="visible d-flex"><CheckOutlined /></div> : <div className="invisible d-flex"><CheckOutlined /></div>,
      onClick: () => handleSortingClick("new")
    },
    {
      label: "Recently updated",
      key: "2",
      icon: selectedItem === "old" ? <div className="visible d-flex"><CheckOutlined /></div> : <div className="invisible d-flex"><CheckOutlined /></div>,
      onClick: () => handleSortingClick("old")
    },
  ]
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false
    },
  });

  const handleSortingClick = async (value) => {
    setLoadingList(true);
    if (selectedItem === value) {
      setSelectedItem(null);
      setLoadingList(false);
      // clearFunc();
    } else {
      setSelectedItem(value);
      const response = await authorizationService.getAllUsers(0, limit, selectedItem || "");

      setLoadingList(false);
      setFilteredData(response.data.users);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response && response.data.totalCount,
        },
      });
    }
  }
  const limit = 10;
  const handleTableChange = async (pagination) => {
    setLoadingList(true);
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
      setFilteredData([]);
    }
    console.log("selectedItem", selectedItem);
    const response = await authorizationService.getAllUsers(offset, limit, selectedItem || "");
    setLoadingList(false);
    setFilteredData(response.data.users)
  }
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
          {/* <Avatar
            size={64}
            src={imageError ? "https://via.placeholder.com/64" : imageUrl} // Fallback image
            alt="Profile Avatar"
            onError={() => setImageError(true)}
          />
          <Image
            width={200}
            src={imageUrl}
          /> */}
          {/* <Avatar src={hasPhoto} /> */}
          <div>
            <Link>
              <ZinInfo />
            </Link>
          </div>
        </div>
      </div>
      <div className="admin-Layout">
        <div className="d-flex align-items-center user-buttons-top">
          {/* Search Icon and Input Field */}
          <div className="search-toolset">
            <Form
              className='search-toolset'
              layout='vertical'
              autoCorrect='off'
              autoCapitalize='off'
              autoComplete='off'
              form={candidateSearchForm}
              onFinish={onFinishSubmissionSearch}
            >
              <ZinSearch />
              <div className="purple-border"></div>
              <Form.Item
                className="mb-0"
                name='searchValue'
                rules={[
                  {
                    min: 3,
                    message: 'Minimum 3 character'
                  },
                  {
                    required: true,
                    message: '',
                  }
                ]}
              >
                <Input
                  value={searchQueryValue}
                  placeholder="Enter search"
                  onChange={submissionSearchChange}
                  suffix={
                    searchQueryValue.length >= 3 && (
                      <ZinClear
                        onClick={() => { clearFunc() }}
                        style={{ color: 'rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                      />
                    )
                  }
                  // disabled={onClickFilterSearchDisabled}   
                  ref={inputRef}
                  autoFocus
                />

              </Form.Item>
            </Form>
            {searchError && <div className="search-error">{searchError}</div>}
          </div>
          <div className={selectedItem ? "cursor-pointer ms-3 sort-bgFilter" : "ms-3 cursor-pointer"} >
            <Tooltip placement="top" title="Sort by">
              <Dropdown
                menu={{
                  items: sortingList,
                  selectable: true,
                }}
                trigger="click"
                arrow={{
                  pointAtCenter: true
                }}
              >
                <ZinSort />
              </Dropdown>
            </Tooltip>
          </div>
          <div className="toolbar me-3 ms-3 text-end">
            <Button type="primary" size="small">
              <Link to="/app/admin/usersettings/user/add">Add</Link>
            </Button>
          </div>
        </div>

        <Table
          columns={usercolumns}
          dataSource={filteredData}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          loading={loadingList}
          scroll={{ x: 1500, y: "calc(100vh -  346px)" }}
        />
      </div>
    </div>
  );
};
