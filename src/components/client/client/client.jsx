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

import { ClientService } from "../../../service";
const { SHOW_PARENT } = TreeSelect;

import "./client.scss";

import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function Client() {
  const [loading, setLoading] = useState(false);

  const [allUsersData, setAllUsersData] = useState([]); // Store original data
  const [filteredData, setFilteredData] = useState([]); // Store searched data
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const inputFocusElement = useRef();
  const [searchError, setSearchError] = useState("");

  const [clientView, setClientView] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const [tableParamsSource, setTableParamsSource] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  // -----------------------------------------------------------  view  --------------------------------------------------------------------------------------------//

  // Fetch Client data

  const limit = 10;
  const getClient = async () => {
    setLoading(true);
    try {
      const offset = 0;
      const response = await ClientService.getClientview(offset, limit, "new");
      if (response?.data) {
        setClientView(response.data.clients || []);
        // setAllUsersData(response.data.clients);
        setFilteredData(response.data.clients);
        setTableParamsSource({
          ...tableParamsSource,
          pagination: {
            ...tableParamsSource.pagination,
            total: response.data.count.totalCount,
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
      const response = await ClientService.getClientview(
        offset,
        pageSize,
        "new"
      );
      setFilteredData(response.data.clients || []);
    } catch (error) {
      console.error("Error fetching paginated clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  }, [filteredData]);

  useEffect(() => {
    getClient();
  }, []);
  const [candidateSearchForm] = Form.useForm();
  const [searchQueryValue, setSearchQueryValue] = useState(null);

  const submissionSearchChange = async (e) => {
    const value = e.target.value;
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
    

  };
  const onFinishSubmissionSearch = async (searchQueryValue) => {
    alert(searchQueryValue);
    setLoading(true);
    const offset = 0;
    const newOffset = offset + limit;
    const response = await ClientService.getClientSearch(offset, limit, "new", "hello");
    console.log("response", response);
  }
  // Table Columns
  const columns = [
    {
      key: "1",
      dataIndex: "clientRefrenceId",
      title: "Client ID",
      width: 100,
      ellipsis: true,

      render: (clientRefrenceId) => (
        <Tooltip title={clientRefrenceId || "N/A"}>
          <span>{clientRefrenceId || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "2",
      dataIndex: "clientName",
      title: "Client Name",
      width: 100,
      ellipsis: true,

      render: (clientName) => (
        <Tooltip title={clientName || "N/A"}>
          <span>{clientName || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "4",
      dataIndex: "federalId",
      title: "Federal ID",
      width: 80,
      ellipsis: true,

      render: (federalId) => (
        <Tooltip title={federalId || "N/A"}>
          <span>{federalId || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "3",
      dataIndex: "clientType",
      title: "Client Type",
      width: 100,
      ellipsis: true,

      render: (clientType) => (
        <Tooltip title={clientType || "N/A"}>
          <span>{clientType || "N/A"}</span>
        </Tooltip>
      ),
    },

    {
      key: "5",
      dataIndex: "websiteUrl",
      title: "Website",
      width: 150,
      ellipsis: true,
      render: (websiteUrl) => {
        const validUrl = websiteUrl?.startsWith("http")
          ? websiteUrl
          : `https://${websiteUrl}`;

        return (
          <>
            {websiteUrl ? (
              <a href={validUrl} target="_blank" rel="noopener noreferrer">
                {websiteUrl}
              </a>
            ) : "N/A"
            }
          </>
        );
      },
      // websiteUrl ? (
      //   <Tooltip title={websiteUrl}>
      //     <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
      //       {websiteUrl}
      //     </a>
      //   </Tooltip>
      // ) : (
      //   "N/A"
      // ),
    },
    {
      key: "6",
      dataIndex: "status",
      title: "Status",
      fixed: "right",
      width: 50,
      align: "center",
      render: (status, record) => (
        <Switch
          // checked={record.status ?? true }
          checked={record.clientStatus}
          // checked={
          //   clientData.find((client) => client._id === record._id)?.status ?? true
          // }
          onChange={(checked) => handleStatusToggle(checked, record)}
          loading={loading && selectedClient?._id === record._id}
          defaultChecked
        />
      ),
    },

    {
      key: "7",
      dataIndex: "_id",
      title: "Action",
      fixed: "right",
      width: 50,
      render: (_id) => (
        <Tooltip title="Edit Client">
          <Button type="link" onClick={() => EditClient(_id)}>
            <ZinEditIcon />
          </Button>
          {/* <Button onClick={() => EditClient(record._id)}>  <ZinEditIcon /></Button> */}
        </Tooltip>
      ),
      className: "actioncolumn-sticky",
    },
  ];




  // --------------------------------------------------------------------------   search    -----------------------------------------------------------------------------//

  // Handle Search
  const handleSearch = (value) => {
    setSearchText(value);

    // Reset if input is empty
    if (!value.trim()) {
      setFilteredData(allUsersData);
      setSearchError("");
      return;
    }

    // Require a minimum of 3 characters for search
    if (value.trim().length < 3) {
      setSearchError("Minimum 3 characters required");
      setFilteredData([]);
      return;
    } else {
      setSearchError("");
    }

    // Filter all fields of the client object
    const filtered = allUsersData.filter((client) =>
      Object.values(client).some((fieldValue) =>
        String(fieldValue).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilteredData(filtered);
  };

  // Clear Search
  const handleClearSearch = () => {



    setSearchText("");
    setFilteredData(allUsersData);
    setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => inputFocusElement.current?.focus(), 100);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  // -------------------------------------------------------------------------  export -------------------------------------------------------------------//

  const [openExport, setOpenExport] = useState(false); //export modal show & hide
  const [value, setValue] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]); //multiselect field
  const [openInactivate, setOpenInactivate] = useState(false); //Inactivate modal show & hide
  const [options, setOptions] = useState([]);

  const clientExport = () => {
    //export modalpopup
    setOpenExport(true);
  };

  const exporthandleOk = () => {
    //export ok button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenExport(false);
    }, 3000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setEnableList(true);
  };

  const inactivatethandleOk = () => {
    //Inactivate ok button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenInactivate(false);
      setischecked(false);
      notification.open({
        className: "company-information-toaster",
        message: "",
        description: "Successfully inactivated the client.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
        placement: "bottomLeft",
      });
    }, 3000);
  };

  const exporthandleCancel = () => {
    //export cancel button
    setOpenExport(false);
  };

  const inactivatehandleCancel = () => {
    //Inactivate cancel button
    setOpenInactivate(false);
  };

  // const onChange = (newValue) => {
  //   console.log("onChange ", value);
  //   setValue(newValue);
  // };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const checkboxOptions = [
    { label: "Client ID", value: "Client ID" },
    { label: "Organization Name", value: "Organization Name" },
    { label: "email", value: "email" },
  ];

  const onChange = (list) => {
    console.log("Checked Values:", list);
    setCheckedList(list);
  };

  const tProps = {
    treeData,
    value,
    onChange,
    expandedKeys,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Select Fields to Export",
    style: {
      width: "100%",
    },
  };

  const [enableList, setEnableList] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const treeData = [
    {
      title: "All",
      value: "all",
      key: "all",
      children: [
        {
          title: "Location",
          value: "location",
          key: "location",
        },
        {
          title: "Client Organization Name",
          value: "clientOrganizationName",
          key: "clientOrganizationName",
        },
        {
          title: "Client ID",
          value: "clientId",
          key: "clientId",
        },
      ],
    },
  ];

  const isAllChecked = checkedList.length === options.length;

  const [selectedClientIds, setSelectedClientIds] = useState([1, 2, 3]); // Selected client IDs
  const [selectedFormat, setSelectedFormat] = useState("csv"); // or "excel"

  const fieldsInfo = [
    "clientName",
    "clientRefrenceId",
    "paymentTerms",
    "websiteUrl",
    "address",
    "email",
    "contactNumber",
  ];

  const getExport = async () => {
    if (!selectedClientIds.length) {
      console.warn("No clients selected for export.");
      return;
    }

    setLoading(true);

    const payload = {
      clientIds: selectedClientIds, // ✅ Selected IDs
      format: selectedFormat, // ✅ "csv" or "excel"
      fieldsInfo: fieldsInfo, // ✅ Fixed fields
    };

    try {
      const data = await ClientService.Exportclient(payload);

      console.log("Exported data:", data);

      if (Array.isArray(data)) {
        const formattedOptions = data.map((item) => ({
          value: item,
        }));
        setOptions(formattedOptions);
      } else {
        console.warn("Unexpected data format:", data);
        setOptions([]);
      }
    } catch (error) {
      console.error("Error exporting clients:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getExport();
  // }, []);

  const onCheckboxChange = (checked, value) => {
    setCheckedList((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle Select All checkbox
  const onSelectAllChange = (checked) => {
    if (checked) {
      setCheckedList(options.map((item) => item.value));
    } else {
      setCheckedList([]);
    }
  };
  // -----------------------------------------------------------   check box -----------------------------------------//

  const rowSelection = {
    selectedRowKeys: checkedList,

    selectedRowKeys,
    onChange: onSelectChange,
    onSelectAll: (selected, selectedRows, changeRows) => {
      const newIds = changeRows.map((record) => record._id);
      setEnableList((pre) => {
        const previousIds = Array.isArray(pre) ? pre : [];
        if (selected) {
          return [...previousIds, ...newIds];
        } else {
          return previousIds.filter((id) => !newIds.includes(id));
        }
      });
    },
    preserveSelectedRowKeys: true,
  };
  // -----------------------------------------------------------------------------   Inactive ---------------------------------------------------------------//

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState([]);

  const handleStatusToggle = async (checked, record) => {
    if (!checked) {
      // alert("hi");
      // If switched OFF (inactive), open confirmation modal
      setSelectedClient(record);
      setOpenInactivate(true);
    } else {
      setLoading(true);
      try {
        const result = await ClientService.Inactiveclient(record._id, true); // Activate
        console.log("Client Activated:", result);
        getClient();
        // Update client list with new status
        setClientData((prevData) =>
          prevData.map((client) =>
            client._id === record._id ? { ...client, status: true } : client
          )
        );
      } catch (error) {
        console.error("Error activating client:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Activate (turn ON)
  const activateClient = async (record) => {
    setLoading(true);
    try {
      await ClientService.Inactiveclient(record._id, true);
      setClientData((prevData) =>
        prevData.map((client) =>
          client._id ?? record._id ? { ...client, status: true } : client
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm deactivation (turn OFF)
  const inactivateHandleOk = async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      await ClientService.Inactiveclient(selectedClient._id, false);
      getClient();
      setClientData((prevData) =>
        prevData.map((client) =>
          client._id ?? selectedClient._id
            ? { ...client, status: false }
            : client
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpenInactivate(false);
      setSelectedClient(null);
    }
  };

  // Cancel the modal (keep switch ON)
  const inactivateHandleCancel = () => {
    setOpenInactivate(false);
    setSelectedClient(null);
  };

  // -----------------------------------------------------------------------------------  Edit ---------------------------------------------------------------------------//

  const location = useLocation();
  const { userDetails, isEditMode } = location.state || {};
  const [form] = Form.useForm();

  async function EditClient(_id) {
    try {
      const res = await ClientService.getClientDetailedview(_id);
      navigate(`/app/admin/clients/edit/${_id}`, {
        state: { state: res.data, isEditModeStatus: true },
      });
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  }





  // const Editview = (Data) => {
  //   navigate(`/app/admin/clients/add?EditId=${Data._id}`, {
  //     state: { userDetails: Data, isEditMode: true },
  //   });
  // };
  // -------------------------------------------------------------------------- Sort by -----------------------------------------------------------------------------------------//
  const [hasMore, setHasMore] = useState(true);
  const [candidateData, setCandidateData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [candidateLimit, setCandidateLimit] = useState(0);


  const handleSortingClick = async (value) => {
    if (selectedItem === value) {
      setSelectedItem(null);
      searchClearFunc();
    } else {
      setLoading(true);
      setSelectedItem(value);
      const offset = 0;
      const newOffset = offset + limit;
      const response = await ClientService.getClientview(offset, limit, value);
      setLoading(false);
      setFilteredData(response.data.clients);
      setLoading(false);
    }
  };

  const sortingList = [
    {
      label: " Recently added",
      key: "1",
      icon: selectedItem === "old" ? <div className="visible d-flex"><CheckOutlined /></div> : <div className="invisible d-flex"><CheckOutlined /></div>,
      onClick: () => handleSortingClick("old")
    },
    {
      label: "Recently updated",
      key: "2",
      icon: selectedItem === "new" ? <div className="visible d-flex"><CheckOutlined /></div> : <div className="invisible d-flex"><CheckOutlined /></div>,
      onClick: () => handleSortingClick("new")
    },
  ]
  // Build the Menu for Dropdown
  // const sortMenu = (
  //   <Menu
  //     items={sortingList.map((item) => ({
  //       key: item.key,
  //       label: (
  //         <div className="d-flex justify-between align-items-center">
  //           {item.label}
  //           {selectedItem === item.key && <CheckOutlined />}
  //         </div>
  //       ),
  //     }))}
  //     onClick={({ key }) => handleSortingClick(key)}
  //   />
  // );

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
            <Breadcrumb.Item>Clients</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex align-items-center">
            {/* <div className="search-toolset">
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
                    value={searchQueryValue && searchQueryValue}
                    placeholder="Enter search"
                    onChange={(e) => submissionSearchChange(e.target.value)}
                    suffix={
                      searchQueryValue && searchQueryValue.length >= 3 && (
                        <ZinClear
                          onClick={() => { clearFunc() }}
                          style={{ color: 'rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                        />
                      )
                    }
                    ref={inputRef}
                    autoFocus
                  />

                </Form.Item>
              </Form>
              {searchError && <div className="search-error">{searchError}</div>}
            </div> */}
            {/* <div className="search-toolset">
              <ZinSearch onClick={handleSearchClick} />
              <div className="purple-border"></div>
              <Input
                ref={inputFocusElement}
                placeholder="Search client name"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                suffix={
                  <div className="suffix-wrapper">
                    <ZinClear
                      onClick={handleClearSearch}
                      className="mb-0"
                      style={{
                        visibility:
                          searchText.length > 1 ? "visible" : "hidden",
                        cursor: searchText.length > 1 ? "pointer" : "default",
                        pointerEvents: searchText.length > 1 ? "auto" : "none",
                      }}
                    />
                  </div>
                }
              />
            </div> */}

            <div className={selectedItem ? "cursor-pointer ms-3 sort-bgFilter" : "ms-3 cursor-pointer"}>
              <Dropdown
                // overlay={sortMenu}
                menu={{
                  items: sortingList,
                  selectable: true,
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div style={{ cursor: "pointer" }}>
                  <ZinSort />
                </div>
              </Dropdown>
            </div>
            {/* <div className="toolbar ms-3 text-end">
              <Button
                type="primary"
                size="small"
                onClick={() => clientExport(true)}
              >
                Export
              </Button>
            </div> */}
            <div className="toolbar ms-3 text-end">
              <Button type="primary" size="small">
                <Link to="/app/admin/clients/add">Add</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="common-SpaceAdmin">
        <Table
          columns={columns}
          dataSource={filteredData} // Use filteredData instead of view
          // rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 1500, y: "calc(100vh -  346px)" }}
          pagination={tableParamsSource.pagination}
          onChange={handleTableChangeByClients}
        />
      </div>

      <>
        <Modal
          open={openExport}
          title="Export Jobs"
          onOk={exporthandleOk}
          centered
          onCancel={exporthandleCancel}
          footer={[
            <Button key="back" onClick={exporthandleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              // type="primary"
              loading={loading}
              onClick={exporthandleOk}
            >
              Export
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12">
              <Form layout="vertical">
                <Form.Item label="Format" className="mb-3">
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select Format"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        label: "csv",
                      },
                      {
                        label: "Excel",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Fields to export" className="mb-3">
                  {loading ? (
                    <Spin tip="Loading..." />
                  ) : (
                    <Select
                      size="large"
                      showSearch
                      placeholder="Select Format"
                      optionFilterProp="children"
                      dropdownRender={() => (
                        <div style={{ padding: 10 }}>
                          <Checkbox
                            checked={isAllChecked}
                            indeterminate={
                              checkedList.length > 0 &&
                              checkedList.length < options.length
                            }
                            onChange={(e) =>
                              onSelectAllChange(e.target.checked)
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              padding: "4px 0",
                              fontWeight: "bold",
                            }}
                          >
                            All
                          </Checkbox>

                          {options.map((option) => (
                            <div
                              key={option.value}
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                padding: "4px 0",
                                gap: "10px",
                              }}
                            >
                              <Checkbox
                                checked={checkedList.includes(option.value)}
                                onChange={(e) =>
                                  onCheckboxChange(
                                    e.target.checked,
                                    option.value
                                  )
                                }
                              />
                              <span>{option.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      style={{ width: "100%", marginTop: "16px" }}
                    />
                  )}
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </>
      <>
        <Modal
          open={openInactivate}
          centered
          title="Inactivate a Client"
          onCancel={inactivateHandleCancel}
          footer={[
            <Button key="back" onClick={inactivateHandleCancel}>
              Cancel
            </Button>,
            <Button key="submit" loading={loading} onClick={inactivateHandleOk}>
              Inactivate
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12">
              <p>
                Are you sure you want to inactivate
                <b>{selectedClient?.name}</b>? Inactivating will disable the
                client but won't delete the data.
              </p>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
}

export default Client;
