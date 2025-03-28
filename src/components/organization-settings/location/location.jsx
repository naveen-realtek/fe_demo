import React, { useState, useEffect, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Menu,
  TreeSelect,
  Table,
  Modal,
  Select,
  Form,
  Switch,
  Pagination,
  Input,
  Tooltip,
  Checkbox,
  Spin,
  Dropdown,
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { CheckOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";

import {
  TcsLogo,
  ZinRightArrow,
  ZinEditIcon,
  ZinSearch,
  ZinClear,
  ZinSort,
} from "../../images";

import { ClientService, authorizationService } from "../../../service";
const { SHOW_PARENT } = TreeSelect;

import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function location() {
  const [loading, setLoading] = useState(false);

  const [allUsersData, setAllUsersData] = useState([]); // Store original data
  const [filteredData, setFilteredData] = useState([]); // Store searched data
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const inputFocusElement = useRef();
  const [searchError, setSearchError] = useState("");

  const [clientView, setClientView] = useState([]);

  const [tableParamsSource, setTableParamsSource] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  // -----------------------------------------------------------  view  --------------------------------------------------------------------------------------------//

  // Fetch Location data

  const limit = 10;
  const getClient = async () => {
    setLoading(true);
    try {
      const offset = 0;
      console.log("Fetching clients with params:", { offset, limit });

      const response = await authorizationService.getlocationview(
        offset,
        limit,
        "new"
      );

      console.log("API Response:", response.data.locations);

      if (response?.data) {
        setClientView(response.data.locations || []);
        setAllUsersData(response.data.locations);
        setFilteredData(response.data.locations);
        setTableParamsSource({
          ...tableParamsSource,
          pagination: {
            ...tableParamsSource.pagination,
            total: response.data.locations.totalCount,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChangeByClients = async (pagination) => {
    setLoading(true);
    const page = pagination.current - 1;
    const pageSize = pagination.pageSize;
    setTableParamsSource((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        current: pagination.current,
        pageSize: pageSize,
      },
    }));
    const offset = page * pageSize;
    if (pageSize !== tableParamsSource.pagination?.pageSize) {
      setFilteredData([]);
    }
    try {
      const response = await authorizationService.getlocationview(
        offset,
        pageSize,
        "new"
      );
      setFilteredData(response.data.locations || []);
    } catch (error) {
      console.error("Error fetching paginated clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetched client view:", filteredData);
  }, [filteredData]);

  useEffect(() => {
    getClient();
  }, []);

  // Table Columns
  const columns = [
    {
      key: "1",
      dataIndex: "unit_name",
      title: "Unit Name",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "2",
      dataIndex: "email",
      title: "Email",
      width: 250,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "3",
      dataIndex: ["phone_code", "phone_number"],
      title: "Phone",
      width: 150,
      ellipsis: true,
      render: (_, record) => {
        if (!record.phone_code && !record.phone_number) return "N/A";
        return `(${record.phone_code || ""}) ${record.phone_number || ""}`;
      },
    },
    {
      key: "4",
      dataIndex: "address_line1",
      title: "Address 1",
      width: 250,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "5",
      dataIndex: "address_line2",
      title: "Address 2",
      width: 250,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "6",
      dataIndex: "country",
      title: "Country",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "7",
      dataIndex: "city",
      title: "City",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "8",
      dataIndex: "state",
      title: "State",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "9",
      dataIndex: "zip_code",
      title: "Zipcode",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "10",
      dataIndex: "time_zone",
      title: "Time Zone",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "11",
      dataIndex: "currency",
      title: "Currency",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "12",
      dataIndex: "date_format",
      title: "Date Format",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "13",
      dataIndex: "time_format",
      title: "Time Format",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "14",
      dataIndex: "business_id",
      title: "Business Hour",
      width: 150,
      ellipsis: true,
      render: (text) => text || "N/A",
    },
    {
      key: "15",
      title: "Status",
      key: "status",
      fixed: "right",
      width: 120,
      align: "center",
      className: "statuscolumn-sticky",
      render: () => <Switch defaultChecked />,
    },
    {
      key: "16",
      dataIndex: "id",
      title: "Action",
      fixed: "right",
      width: 80,
      className: "actioncolumn-sticky",
      render: (id) => (
        <Button type="link" onClick={() => Editlocation(id)}>
          <ZinEditIcon />
        </Button>
      ),
    },
  ];

  // --------------------------------------------------------------------------   search    -----------------------------------------------------------------------------//

  // Handle Search
  // const handleSearch = (value) => {
  //   setSearchText(value);

  //   // Reset if input is empty
  //   if (!value.trim()) {
  //     setFilteredData(allUsersData);
  //     setSearchError("");
  //     return;
  //   }

  //   // Require a minimum of 3 characters for search
  //   if (value.trim().length < 3) {
  //     setSearchError("Minimum 3 characters required");
  //     setFilteredData([]);
  //     return;
  //   } else {
  //     setSearchError("");
  //   }

  //   // Filter all fields of the client object
  //   const filtered = allUsersData.filter((client) =>
  //     Object.values(client).some((fieldValue) =>
  //       String(fieldValue).toLowerCase().includes(value.toLowerCase())
  //     )
  //   );

  //   setFilteredData(filtered);
  // };

  // const handleSearch = (value) => {
  //   // Remove leading, trailing, and extra spaces
  //   const cleanedValue = value.trim().replace(/\s+/g, " ");
  //   setSearchText(cleanedValue);
  // };

  // // Clear Search

  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => inputFocusElement.current?.focus(), 100);
  };

  // -----------------------------------------------------------------------------------  Edit ---------------------------------------------------------------------------//

  const location = useLocation();
  const [form] = Form.useForm();

  async function Editlocation(id) {
    try {
      setLoading(true);
      const res = await authorizationService.getlocationview(id);
      setLoading(false);

      if (res?.data) {
        navigate(`/app/admin/location/edit/${id}`, {
          state: { locationData: res.data, isEditModeStatus: true },
        });
      } else {
        console.error("No data returned for location ID:", id);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching location details:", error);
    }
  }

  // -------------------------------------------------------------------------- Sort by -----------------------------------------------------------------------------------------//
  const [hasMore, setHasMore] = useState(true);
  const [candidateData, setCandidateData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [candidateLimit, setCandidateLimit] = useState(0);

  const sortingList = [
    {
      label: "Recently added",
      key: "addedNew",
    },
    {
      label: "Recently updated",
      key: "updatedNew",
    },
    {
      label: "Recently submitted",
      key: "submittedNew",
    },
  ];

  const handleSortingClick = async (value) => {
    if (selectedItem === value) {
      setSelectedItem(null);
      searchClearFunc();
    } else {
      setLoading(true);
      setSelectedItem(value);
      const offset = 0;
      const newOffset = offset + limit;
      const response = await authorizationService.getlocationview(
        offset,
        limit,
        value
      );
      if (response.data.locations.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      const updatedData = [
        response.data.locations[0],
        ...candidateData.filter(
          (item) => item.id !== response.data.locations[0].id
        ),
      ];
      setOffset(newOffset);
      setCandidateLimit(response?.limit);
      setCandidateData(updatedData);
      setLoading(false);
    }
  };

  const [selectedItem, setSelectedItem] = useState();

  // Build the Menu for Dropdown
  const sortMenu = (
    <Menu
      items={sortingList.map((item) => ({
        key: item.key,
        label: (
          <div className="d-flex justify-between align-items-center">
            {item.label}
            {selectedItem === item.key && <CheckOutlined />}
          </div>
        ),
      }))}
      onClick={({ key }) => handleSortingClick(key)}
    />
  );

  // ------------------------------------------------------------  Search ---------------------------------------------------//

  const [locationData, setLocationData] = useState([]);

  const [tagJobNone, setTagJobNone] = useState("");

  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [jobSearchForm] = Form.useForm();

  console.log("locationSearchValue", locationSearchValue);

  const locationsearch = async (value, currentOffset = 0) => {
    if (value && value.length > 2) {
      try {
        setLoading(true);
        const response = await authorizationService.getlocationsearch(
          currentOffset,
          limit,
          value
        );
        setLoading(false);

        if (!response.items || response.items.length === 0) {
          setTagJobNone("");
          setLocationData([]);
        } else {
          setTagJobNone("");
          setLocationData(response.items);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching location data:", error);
      }
    } else {
      setLocationData([]);
      setTagJobNone("empty-dropDownSelect");
    }
  };

  useEffect(() => {
    if (searchText.length > 2) {
      locationsearch(searchText, offset);
    }
  }, [searchText, offset]);

  const locationSearchValueOnChange = (e) => {
    const values = e.target.value;
    if (values && values.length > 0) {
      setLocationSearchValue(values);
    } else {
      clearFunc();
    }
  };

  const onFinishJobSearch = async () => {
    setLoading(true);
    const response = await authorizationService.getlocationsearch(
      offset,
      limit,
      "new",
      locationSearchValue
    );
    setLoading(false);
    setFilteredData(response.data?.locations || []);
  };

  //   const clearFunc = async () => {
  //     setLoading(true);
  //     // Reset search-related states
  //     setSearchText("");
  //     setLocationSearchValue("");
  //     setOffset(0);
  //     console.log("Search cleared!");
  //   setLoading(false)
  // };

  const clearFunc = async () => {
    setSearchText("");
    setLocationSearchValue("");
    setOffset(0);

    console.log("Search cleared!");

    setLoading(true);
    try {
      const response = await authorizationService.getlocationsearch(
        0,
        limit || 10,
        "new"
      );

      const locations = response?.data?.locations;
      if (Array.isArray(locations) && locations.length > 0) {
        setLocationData(locations);
      } else {
        setLocationData([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-breadcrums">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <Breadcrumb separator={<ZinRightArrow />}>
            <Breadcrumb.Item>
              <Link to="/app/dashboard">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/app/admin">Admin</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item
              overlay={<OverlayMenuDropdown type="Organization settings" />}
            >
              Organization Settings
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="app/admin/location">Locations</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex">
            <div className="search-toolset">
              <Form
                className="search-toolset"
                layout="vertical"
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                form={jobSearchForm}
                onFinish={onFinishJobSearch}
              >
                <ZinSearch />
                <div className="purple-border"></div>
                <Form.Item
                  className="mb-0"
                  name="searchValue"
                  rules={[
                    {
                      min: 3,
                      message: "Minimum 3 character",
                    },
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input
                    value={locationSearchValue}
                    placeholder="Search location"
                    onChange={locationSearchValueOnChange}
                    suffix={
                      locationSearchValue &&
                      locationSearchValue.length >= 3 && (
                        <ZinClear
                          onClick={clearFunc} // ✅ Calls the optimized function
                          style={{
                            color: "rgba(0, 0, 0, 0.25)",
                            cursor: "pointer",
                          }}
                        />
                      )
                    }
                    // disabled={onClickFilterSearchDisabled}
                    autoFocus
                  />
                </Form.Item>
              </Form>
              {/* <ZinSearch onClick={() => locationsearch(searchText)} />
              <div className="purple-border"></div>
              <Input
                ref={inputFocusElement}
                placeholder="Search location"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                suffix={
                  <div className="suffix-wrapper">
                    <ZinClear
                      onClick={handleClearSearch}
                      className="mb-0"
                      style={{
                        visibility: searchText.length > 3 ? "visible" : "hidden",
                        cursor: searchText.length > 3 ? "pointer" : "default",
                        pointerEvents: searchText.length > 3 ? "auto" : "none",
                      }}
                    />
                  </div>
                }
              />
              {locationData.length > 0 && (
                <ul className="location-dropdown">
                  {locationData.map((item, index) => (
                    <li key={index}>{item.name}</li>
                  ))}
                </ul>
              )} */}
            </div>
            <div className="toolbar ms-3 text-end">
              <Dropdown
                overlay={sortMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div style={{ cursor: "pointer" }}>
                  <ZinSort />
                </div>
              </Dropdown>
            </div>

            <div className="toolbar ms-3 text-end">
              <Button type="primary" size="small">
                <Link to="/app/admin/location/add">Add</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="common-SpaceAdmin">
        <Table
          columns={columns}
          dataSource={filteredData}
          // rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 1500, y: "calc(100vh -  346px)" }}
          pagination={tableParamsSource.pagination}
          onChange={handleTableChangeByClients}
        />
      </div>
    </>
  );
}
export default location;
